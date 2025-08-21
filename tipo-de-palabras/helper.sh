#!/bin/bash

# Función que concatena todos los archivos del directorio actual en todo.txt
concatenar_archivos() {
    local output_file="todo.txt"
    
    # Eliminar el archivo de salida si existe para reescribirlo completamente
    [[ -f "$output_file" ]] && rm "$output_file"
    
    # Función recursiva para procesar archivos y carpetas
    procesar_elemento() {
        local elemento="$1"
        local nivel="$2"
        local prefijo=""
        
        # Crear indentación según el nivel
        for ((i=0; i<nivel; i++)); do
            prefijo+="  "
        done
        
        if [[ -f "$elemento" ]]; then
            # Es un archivo
            echo "${prefijo}=== $elemento ===" >> "$output_file"
            cat "$elemento" >> "$output_file"
            echo "" >> "$output_file"
        elif [[ -d "$elemento" ]]; then
            # Es un directorio
            echo "${prefijo}=== DIRECTORIO: $elemento ===" >> "$output_file"
            echo "" >> "$output_file"
            
            # Procesar contenido del directorio
            for sub_elemento in "$elemento"/*; do
                # Verificar que el glob no esté vacío
                [[ -e "$sub_elemento" ]] || continue
                procesar_elemento "$sub_elemento" $((nivel + 1))
            done
        fi
    }
    
    # Iterar sobre todos los elementos en el directorio actual
    for elemento in *; do
        # Verificar que el elemento existe y no sea el archivo de salida ni helper.sh
        if [[ -e "$elemento" && "$elemento" != "$output_file" && "$elemento" != "helper.sh" ]]; then
            procesar_elemento "$elemento" 0
        fi
    done
    
    echo "Todos los archivos han sido concatenados en $output_file"
}

# Llamar la función
concatenar_archivos