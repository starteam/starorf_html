#!/bin/bash
java -jar web-tools/compiler.jar --js src/app_new.js --process_jquery_primitives --js_output_file prod/app.js --js src/lib/jcanvas.js
