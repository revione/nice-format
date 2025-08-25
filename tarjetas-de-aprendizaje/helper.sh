#!/bin/bash

# Función que concatena archivos y procesa directorios
concatenar_archivos() {
    local txt_folder="txt"
    local output_file="$txt_folder/todo.txt"
    
    # Eliminar la carpeta txt si existe para empezar desde cero
    [[ -d "$txt_folder" ]] && rm -rf "$txt_folder"
    
    # Crear el directorio txt
    mkdir -p "$txt_folder"
    
    # Función recursiva para procesar directorios
    procesar_directorio() {
        local directorio="$1"
        # Reemplazar las barras por guiones bajos para el nombre del archivo
        local nombre_archivo=$(echo "$directorio" | tr '/' '_')
        local archivo_directorio="$txt_folder/${nombre_archivo}.txt"
        
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
                
                # También añadir al archivo todo.txt
                echo "=== $elemento ===" >> "$output_file"
                cat "$elemento" >> "$output_file"
                echo "" >> "$output_file"
            elif [[ -d "$elemento" ]]; then
                # Es un subdirectorio - procesarlo recursivamente
                procesar_directorio "$elemento"
                local nombre_sub_archivo=$(echo "$elemento" | tr '/' '_')
                echo "=== SUBDIRECTORIO: $nombre_elemento (ver $txt_folder/${nombre_sub_archivo}.txt) ===" >> "$archivo_directorio"
                echo "" >> "$archivo_directorio"
            fi
        done
        
        echo "Archivo creado: $archivo_directorio"
    }
    
    # Procesar todos los elementos del directorio actual y crear archivo raíz
    local archivo_raiz="$txt_folder/raiz.txt"
    > "$archivo_raiz"
    
    echo "=== CONTENIDO DEL DIRECTORIO RAÍZ ===" >> "$archivo_raiz"
    echo "" >> "$archivo_raiz"
    
    for elemento in *; do
        # Excluir helper.sh y el folder txt
        if [[ -e "$elemento" && "$elemento" != "helper.sh" && "$elemento" != "$txt_folder" ]]; then
            if [[ -f "$elemento" ]]; then
                # Es un archivo - añadir a raíz.txt y a todo.txt
                echo "=== $elemento ===" >> "$archivo_raiz"
                cat "$elemento" >> "$archivo_raiz"
                echo "" >> "$archivo_raiz"
                
                echo "=== $elemento ===" >> "$output_file"
                cat "$elemento" >> "$output_file"
                echo "" >> "$output_file"
            elif [[ -d "$elemento" ]]; then
                # Es un directorio - crear archivo separado y hacer referencia
                procesar_directorio "$elemento"
                echo "=== DIRECTORIO: $elemento (ver $txt_folder/${elemento}.txt) ===" >> "$archivo_raiz"
                echo "" >> "$archivo_raiz"
            fi
        fi
    done
    
    echo "Procesamiento completado:"
    echo "- TODO (todos los archivos) → $output_file"
    echo "- Primer nivel (raíz) → $txt_folder/raiz.txt"
    echo "- Directorios → archivos separados en $txt_folder/"
}

# Ejecutar la función
concatenar_archivos