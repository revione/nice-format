#!/bin/bash

# Función que concatena archivos y procesa directorios
concatenar_archivos() {
    local txt_folder="txt"
    local output_file="$txt_folder/todo.txt"
    
    # Crear el directorio txt si no existe
    mkdir -p "$txt_folder"
    
    # Eliminar el archivo de salida si existe para reescribirlo completamente
    [[ -f "$output_file" ]] && rm "$output_file"
    
    # Función recursiva para procesar directorios
    procesar_directorio() {
        local directorio="$1"
        local archivo_directorio="$txt_folder/${directorio}.txt"
        
        # Crear el archivo para este directorio
        > "$archivo_directorio"
        
        echo "=== CONTENIDO DEL DIRECTORIO: $directorio ===" >> "$archivo_directorio"
        echo "" >> "$archivo_directorio"
        
        # Procesar todos los elementos dentro del directorio
        for elemento in "$directorio"/*; do
            # Verificar que el elemento existe
            [[ -e "$elemento" ]] || continue
            
            local nombre_elemento=$(basename "$elemento")
            
            if [[ -f "$elemento" ]]; then
                # Es un archivo - concatenar su contenido
                echo "=== $nombre_elemento ===" >> "$archivo_directorio"
                cat "$elemento" >> "$archivo_directorio"
                echo "" >> "$archivo_directorio"
            elif [[ -d "$elemento" ]]; then
                # Es un subdirectorio - procesarlo recursivamente
                procesar_directorio "$elemento"
                echo "=== SUBDIRECTORIO: $nombre_elemento (ver $txt_folder/${elemento}.txt) ===" >> "$archivo_directorio"
                echo "" >> "$archivo_directorio"
            fi
        done
        
        echo "Archivo creado: $archivo_directorio"
    }
    
    # Procesar todos los elementos del directorio actual
    for elemento in *; do
        # Excluir helper.sh y el folder txt
        if [[ -e "$elemento" && "$elemento" != "helper.sh" && "$elemento" != "$txt_folder" ]]; then
            if [[ -f "$elemento" ]]; then
                # Es un archivo - añadir a todo.txt
                echo "=== $elemento ===" >> "$output_file"
                cat "$elemento" >> "$output_file"
                echo "" >> "$output_file"
            elif [[ -d "$elemento" ]]; then
                # Es un directorio - crear archivo separado
                procesar_directorio "$elemento"
            fi
        fi
    done
    
    echo "Procesamiento completado:"
    echo "- Archivos individuales → $output_file"
    echo "- Directorios → archivos separados en $txt_folder/"
}

# Ejecutar la función
concatenar_archivos