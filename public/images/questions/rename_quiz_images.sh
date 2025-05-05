#!/bin/bash

# Функция для валидации числа
validate_number() {
    if ! [[ "$1" =~ ^[0-9]+$ ]]; then
        echo "Error: '$1' is not a valid number"
        return 1
    fi
    if [ "$1" -lt 1 ] || [ "$1" -gt 999 ]; then
        echo "Error: Number must be between 1 and 999"
        return 1
    fi
    return 0
}

# Запрашиваем начальный и конечный номера
read -p "Enter starting question number (q?): " start_number
if ! validate_number "$start_number"; then
    exit 1
fi

read -p "Enter ending question number (q?): " end_number
if ! validate_number "$end_number"; then
    exit 1
fi

# Проверяем, что конечный номер больше начального
if [ "$end_number" -le "$start_number" ]; then
    echo "Error: End number must be greater than start number"
    exit 1
fi

total_files=$((end_number - start_number + 1))
echo
echo "You want to rename files from q${start_number}.png to q${end_number}.png (total: $total_files files)"
echo

# Создаём резервную копию
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="backup_q${start_number}-q${end_number}_${timestamp}"
echo "Creating backup in '$backup_dir'..."
mkdir -p "$backup_dir"

# Копируем только нужные файлы в папку бекапа
cp Screenshot\ 2025-05-05*.png "$backup_dir/" 2>/dev/null
echo "✓ Backup created successfully"
echo

# Создаём временный файл для списка файлов с их временными метками
temp_file=$(mktemp)

# Получаем ТОЛЬКО файлы, соответствующие точному паттерну
file_found=false
for file in Screenshot\ 2025-05-05*.png; do
    # Проверяем, что файл существует
    if [ -f "$file" ]; then
        file_found=true
        # Извлекаем время из имени файла
        time_string=$(echo "$file" | grep -o '[0-9]\{2\}\.[0-9]\{2\}\.[0-9]\{2\}')
        if [ ! -z "$time_string" ]; then
            hour=$(echo "$time_string" | cut -d. -f1)
            minute=$(echo "$time_string" | cut -d. -f2)
            second=$(echo "$time_string" | cut -d. -f3)
            comparable_time="$hour$minute$second"
            echo "$comparable_time|$file" >> "$temp_file"
        fi
    fi
done

if [ "$file_found" = false ]; then
    echo "Error: No files matching pattern 'Screenshot 2025-05-05*.png' found"
    rm "$temp_file"
    exit 1
fi

# Подсчитываем файлы
file_count=$(cat "$temp_file" | wc -l)
echo "Found $file_count files matching pattern 'Screenshot 2025-05-05*.png'"

# Проверяем, достаточно ли файлов
if [ "$file_count" -ne "$total_files" ]; then
    echo "Warning: You requested $total_files files (q${start_number} to q${end_number}) but found $file_count files"
    echo "Some question numbers will be skipped or exceeded"
fi

echo

# Сортируем файлы по времени и показываем предварительный просмотр
echo "===== Preview of renaming operations ====="
echo "ONLY files matching 'Screenshot 2025-05-05 at HH.MM.SS.png' will be renamed"
echo
printf "%-5s | %-40s | %-10s\n" "No." "Before" "After"
echo "------+------------------------------------------+------------"

question_number="$start_number"
sort -k1 "$temp_file" | while IFS='|' read -r timestamp filename; do
    new_name="q${question_number}.png"
    printf "%-5d | %-40s | %-10s\n" "$question_number" "$filename" "$new_name"
    question_number=$((question_number + 1))
    
    # Останавливаемся, если достигли конечного номера
    if [ "$question_number" -gt "$end_number" ]; then
        break
    fi
done

# Проверяем корректность порядка
first_file=$(sort -k1 "$temp_file" | head -1 | cut -d'|' -f2)
last_file=$(sort -k1 "$temp_file" | head -$total_files | tail -1 | cut -d'|' -f2)

echo
echo "===== Verification ====="
echo "First file: $first_file"
echo "Last file: $last_file"

# Подтверждение
echo
read -p "Do you want to proceed with the renaming? (y/n): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo
    echo "Performing renaming operations..."
    
    question_number="$start_number"
    sort -k1 "$temp_file" | while IFS='|' read -r timestamp filename; do
        new_name="q${question_number}.png"
        
        # Останавливаемся, если достигли конечного номера
        if [ "$question_number" -gt "$end_number" ]; then
            break
        fi
        
        # Проверяем, не существует ли уже файл с таким именем
        if [ -f "$new_name" ]; then
            echo "Warning: File $new_name already exists, skipping renaming of '$filename'"
        else
            mv "$filename" "$new_name"
            echo "✓ Renamed: $filename -> $new_name"
        fi
        
        question_number=$((question_number + 1))
    done
    
    echo
    echo "Renaming complete!"
    echo "Files have been renamed from q${start_number}.png to q${end_number}.png"
    echo "All other files remain unchanged"
    echo "Backup is available in '$backup_dir'"
else
    echo "Operation cancelled."
fi

# Удаляем временный файл
rm "$temp_file"

# Показываем итоговое состояние
echo
echo "Files in directory:"
echo "Screenshot files (if any remain):"
ls -la Screenshot\ 2025-05-05*.png 2>/dev/null || echo "No Screenshot files left"
echo
echo "New q-files:"
ls -la q$start_number.png q$end_number.png 2>/dev/null || echo "No q-files found"