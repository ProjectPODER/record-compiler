# OCDS Record Compiler

Este script toma un listado de *ocid* únicos separados por newline (**\n**) desde *stdin*, y devuelve objetos de tipo [OCDS Record](http://standard.open-contracting.org/latest/en/schema/records_reference/) por *stdout*, compilados a partir de los [releases](http://standard.open-contracting.org/latest/en/schema/reference/) que se encuentran en las colecciones de MongoDB recibidas como parámetros.

## Ejemplo de uso

Desde el directorio raíz:

    node index.js -d quienesquienwiki -c contracts_ocds

Este script se utiliza en conjunto con [ocds-unique](http://gitlab.rindecuentas.org/equipo-qqw/ocds-unique) para realizar la unificación de releases procesados por [Poppins](http://gitlab.rindecuentas.org/equipo-qqw/poppins) y convertir a los records que devuelve [la API de QQW](http://gitlab.rindecuentas.org/equipo-qqw/QuienEsQuienApi).

    node ocds-unique/index.js -d quienesquienwiki -c contracts_ocds | node record-compiler/index.js -d quienesquienwiki -c contracts_ocds

## Opciones

El script acepta las siguientes opciones como argumentos:

    --database      -d  El nombre de la base de datos que contiene los contratos
    --collections   -c  El listado de colecciones con documentos OCDS
