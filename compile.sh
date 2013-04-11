#!/bin/bash
java -jar web-tools/compiler.jar --js src/aminoacids.js --js src/app.js --process_jquery_primitives --js_output_file prod/app.js --js src/lib/jcanvas.js
