#!/bin/bash

# Определение относительных путей от местоположения скрипта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JSON_FILE="$SCRIPT_DIR/public/AzureDevOps.json"
IMAGES_DIR="$SCRIPT_DIR/public/images/questions"
BACKUP_DIR="$SCRIPT_DIR/backups"

# Базовый путь для добавления в JSON (относительно корня веб-приложения)
IMAGE_BASE_PATH="public/images/questions"

# Показать информацию о скрипте
echo "==== Скрипт для добавления путей к изображениям в JSON ===="
echo "  JSON-файл: $JSON_FILE"
echo "  Директория с изображениями: $IMAGES_DIR"
echo "  Формат путей для JSON: $IMAGE_BASE_PATH/q*.png"
echo "  Формат имен файлов: q1.png, q100.png, q102_1.png, q323_4.png и т.д."
echo

# Предложить просмотр текущего состояния директории
read -p "Показать список изображений в директории? (y/n): " show_images
if [ "$show_images" = "y" ]; then
    echo "Список изображений в директории $IMAGES_DIR:"
    find "$IMAGES_DIR" -type f -name "q*.png" | sort | head -20
    count=$(find "$IMAGES_DIR" -type f -name "q*.png" | wc -l)
    if [ "$count" -gt 20 ]; then
        echo "... и еще $(($count - 20)) изображений"
    fi
    echo
fi

# Подтверждение перед выполнением
read -p "Продолжить обновление JSON файла? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Операция отменена."
    exit 1
fi

# Создаем директорию для резервных копий, если она не существует
mkdir -p "$BACKUP_DIR"

# Создаем резервную копию исходного JSON
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/AzureDevOps_backup_$TIMESTAMP.json"
cp "$JSON_FILE" "$BACKUP_FILE"
echo "✓ Создана резервная копия: $BACKUP_FILE"

# Проверяем наличие необходимых утилит
if ! command -v jq &> /dev/null; then
    echo "Ошибка: jq не установлен. Пожалуйста, установите jq для работы с JSON."
    echo "Установка: sudo apt-get install jq (для Ubuntu/Debian)"
    exit 1
fi

# Временный файл для обновленного JSON
TEMP_JSON=$(mktemp)

# Проверка наличия файлов и директорий
if [ ! -f "$JSON_FILE" ]; then
    echo "Ошибка: Файл JSON не найден: $JSON_FILE"
    exit 1
fi

if [ ! -d "$IMAGES_DIR" ]; then
    echo "Ошибка: Директория с изображениями не найдена: $IMAGES_DIR"
    exit 1
fi

# Получаем список всех изображений в директории
echo "Анализ директории с изображениями: $IMAGES_DIR"
IMAGE_COUNT=$(find "$IMAGES_DIR" -type f -name "q*.png" | wc -l)
if [ "$IMAGE_COUNT" -eq 0 ]; then
    echo "Предупреждение: В директории не найдено изображений, соответствующих шаблону q*.png"
    echo "Проверьте путь к директории: $IMAGES_DIR"
    read -p "Продолжить без изображений? (y/n): " continue_without_images
    if [ "$continue_without_images" != "y" ]; then
        echo "Операция отменена."
        exit 1
    fi
fi

IMAGE_FILES=$(find "$IMAGES_DIR" -type f -name "q*.png" | sort)

# Создаем ассоциативный массив для хранения путей к изображениям по ID вопроса
declare -A image_paths

# Заполняем массив путями к изображениям
echo "Индексирование изображений..."
for img_path in $IMAGE_FILES; do
    # Извлекаем имя файла без пути
    filename=$(basename "$img_path")
    
    # Извлекаем ID вопроса из имени файла (например, из "q123_1.png" получаем "123")
    if [[ $filename =~ q([0-9]+)(_[0-9]+)?.png ]]; then
        question_id="${BASH_REMATCH[1]}"
        
        # Формируем относительный путь к изображению (относительно корня веб-приложения)
        relative_path="$IMAGE_BASE_PATH/$filename"
        
        # Добавляем путь в массив для данного ID
        if [[ -n "${image_paths[$question_id]}" ]]; then
            image_paths[$question_id]="${image_paths[$question_id]},$relative_path"
        else
            image_paths[$question_id]="$relative_path"
        fi
    fi
done

echo "Найдено изображений для $(echo "${!image_paths[@]}" | wc -w) вопросов"

# Функция для обновления массива images в JSON для конкретного вопроса
update_question_images() {
    local json="$1"
    local question_id="$2"
    local image_paths_str="$3"
    
    # Преобразуем строку с путями в массив JSON
    IFS=',' read -ra paths_array <<< "$image_paths_str"
    json_array="["
    for path in "${paths_array[@]}"; do
        json_array+="\"$path\","
    done
    # Удаляем последнюю запятую и закрываем массив
    json_array="${json_array%,}]"
    
    # Обновляем JSON
    echo "$json" | jq --arg id "$question_id" --argjson images "$json_array" '
        map(if .id == $id then .images = $images else . end)
    '
}

# Читаем JSON-файл
json_content=$(cat "$JSON_FILE")

# Проверяем, что JSON начинается со скобки массива
if [[ $json_content != [* ]]; then
    # Если JSON не начинается с [, значит это объект, в котором массив вопросов находится в поле
    # Пытаемся найти правильное поле с вопросами
    echo "JSON не является массивом. Пытаемся найти массив вопросов внутри объекта..."
    
    # Предполагаем, что массив может быть в поле questions, items, data и т.д.
    possible_fields=("questions" "items" "data" "content")
    found=false
    
    for field in "${possible_fields[@]}"; do
        if jq ".$field" "$JSON_FILE" &>/dev/null; then
            echo "Найден массив вопросов в поле: $field"
            
            # Извлекаем массив вопросов
            questions_json=$(jq ".$field" "$JSON_FILE")
            
            # Обновляем массив вопросов
            updated_questions="$questions_json"
            for question_id in "${!image_paths[@]}"; do
                updated_questions=$(update_question_images "$updated_questions" "$question_id" "${image_paths[$question_id]}")
            done
            
            # Обновляем JSON, заменяя массив вопросов
            jq --argjson updated "$updated_questions" ".$field = \$updated" "$JSON_FILE" > "$TEMP_JSON"
            found=true
            break
        fi
    done
    
    if [ "$found" = false ]; then
        echo "Ошибка: Не удалось найти массив вопросов в JSON. Пожалуйста, проверьте структуру файла."
        exit 1
    fi
else
    # JSON уже является массивом вопросов
    # Обновляем JSON для каждого вопроса, где есть изображения
    updated_json="$json_content"
    for question_id in "${!image_paths[@]}"; do
        updated_json=$(update_question_images "$updated_json" "$question_id" "${image_paths[$question_id]}")
    done
    
    echo "$updated_json" > "$TEMP_JSON"
fi

# Проверяем, что выходной JSON валидный
if ! jq empty "$TEMP_JSON" 2>/dev/null; then
    echo "Ошибка: Сгенерированный JSON невалидный. Операция отменена."
    echo "Исходный файл остался без изменений. Проверьте резервную копию: $BACKUP_FILE"
    rm "$TEMP_JSON"
    exit 1
fi

# Перемещаем временный файл на место оригинального
mv "$TEMP_JSON" "$JSON_FILE"

# Подсчитываем, сколько вопросов было обновлено и с каким количеством изображений
total_questions=$(echo "${!image_paths[@]}" | wc -w)
single_image_questions=0
multiple_image_questions=0

for question_id in "${!image_paths[@]}"; do
    # Подсчитываем количество изображений для вопроса
    image_count=$(echo "${image_paths[$question_id]}" | tr ',' '\n' | wc -l)
    if [ "$image_count" -eq 1 ]; then
        single_image_questions=$((single_image_questions + 1))
    else
        multiple_image_questions=$((multiple_image_questions + 1))
    fi
done

echo "✓ Успех! JSON файл обновлен путями к изображениям."
echo "  - Всего обработано вопросов: $total_questions"
echo "  - Вопросы с одним изображением: $single_image_questions"
echo "  - Вопросы с несколькими изображениями: $multiple_image_questions"
echo "  - Резервная копия: $BACKUP_FILE"

# Выводим пример первых нескольких обновленных вопросов для проверки
echo
echo "Примеры обновленных вопросов (первые 3):"
counter=0
for question_id in $(echo "${!image_paths[@]}" | tr ' ' '\n' | sort -n | head -3); do
    echo "  Вопрос ID $question_id:"
    echo "    Изображения: ${image_paths[$question_id]}"
    counter=$((counter + 1))
done