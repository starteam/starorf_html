define([ "StarORF/aminoacids", 'jquery', 'jquery-ui', 'css!jquery-ui-css', 'css!StarORF/main'], function (AminoAcids, $) {
    window.starORF_jQuery_debug = $
    var config = {};
    var decodedForward = null;
    var decodedReverse = null;
    var sequence = "";
    var sliderValue = 0;
    var orf = {};

    function is_defined(element) {
        return !(typeof variable === 'undefined');
    }

    function get_config(config_obj, key, default_value) {
        return is_defined(config_obj[key]) ? config_obj[key] : default_value;
    }

    function parse_config(config_obj) {
        config.element_id = config_obj.element_id;
        config.sequence = config_obj.sequence ? config_obj.sequence : "/StarORF/sequence.txt";

        config.sequence_id = config.element_id + "_sequence";
        config.length_id = config.element_id + "_length";
        config.gc_percentage_id = config.element_id + "_gc_percentage";
        config.minimal_orf_length_id = config.element_id + "_minimal_orf_length";
        config.minimal_orf_length_button_id = config.element_id + "_minimal_orf_length_button";
        config.reverse_complement_id = config.element_id + "_reverse_complement_button";
        config.calculate_all_orfs_id = config.element_id + "_calculate_all_orfs_button";
        config.toggle_3_1_letter_code_id = config.element_id + "_toggle_3_1_letter_code";
        config.canvas_id = config.element_id + "_canvas";
        config.slider_id = config.element_id + "_slider";
        config.putative_orf_id = config.element_id + "_putative_orf";
        config.blast_putative_orf_id = config.element_id + "_blast_putative_orf";
        config.all_orfs_id = config.element_id + "_all_orfs";


        config.show_input_sequence = get_config(config_obj, "show_input_sequence", true);
        config.show_input_sequence_title = get_config(config_obj, "show_input_sequence_title", true);
        config.show_sequence_length = get_config(config_obj, "show_sequence_length", true);
        config.show_gc_percentage = get_config(config_obj, "show_gc_percentage", true);
        config.show_minimal_orf_length = get_config(config_obj, "show_minimal_orf_length", true);
        config.show_minimal_orf_length_button = get_config(config_obj, "show_minimal_orf_length_button", true);

        config.initial_minimal_orf_legth = get_config(config_obj, "minimal_orf_legth", 80);
        config.show_reverse_complement = get_config(config_obj, "show_reverse_complement", true);
        config.show_calculate_all_orfs = get_config(config_obj, "show_calculate_all_orfs", true);
        config.show_3_1_letter_code_toggle = get_config(config_obj, "show_3_1_letter_code_toggle", true);
        config.initial_letter_code_type = get_config(config_obj, "initial_letter_code_type", 3);
        config.show_slider = get_config(config_obj, "show_slider", true);
        config.show_putative_orf = get_config(config_obj, "show_putative_orf", true);
        config.show_blast_putative_orf = get_config(config_obj, "show_blast_putative_orf", true);

        config.output_selector = null;
        config.output_letter_code_type = 1;
        config.output_basepair_start = false;
        config.output_basepair_end = false;
        config.output_basepair_length = false;
        config.output_separator = ",";
    }

    function $q(str) {
        return $("#" + str);
    }

    function trim(seq) {
        return seq.replace(/[^atgcu]/mig, '').replace(/t/mig, 'u').toUpperCase();
    }

    function complementChar(c) {
        if (c == 'G') {
            c = 'C';
        } else if (c == 'g') {
            c = 'c';
        } else if (c == 'C') {
            c = 'G';
        } else if (c == 'c') {
            c = 'g';
        } else if (c == 'a') {
            c = 'u';
        } else if (c == 'A') {
            c = 'U';
        } else if (c == 'T') {
            c = 'A';
        } else if (c == 't') {
            c = 'a';
        } else if (c == 'u') {
            c = 'a';
        } else if (c == 'U') {
            c = 'A';
        }
        return c;
    }

    function parseAminoAcids() {
        CodonMap = {};
        for (aa in AminoAcids) {
            if (aa != 'START') {
                var list = AminoAcids[aa].codes;
                for (i in list) {
                    CodonMap[list[i]] = aa;
                }
            }
        }
        this.CodonMap = CodonMap;
    }

    /** high level functions START */
    function reverse_complement() {
        var seq = $q(config.sequence_id);
        var sequence = trim(seq.val());
        var ret = reverseComplementString(sequence);
        seq.val(ret).trigger('change');
    }

    function calculate_gc_content() {
        var sequence = $q(config.sequence_id).val();
        ;
        var gc = 0;
        for (var i = 0; i < sequence.length; i++) {
            var c = sequence.charAt(i);
            if (c == 'g' || c == 'G' || c == 'c' || c == 'C') {
                gc++;
            }
        }
        var perc = 0;
        if (sequence.length != 0) {
            perc = gc / sequence.length;
        }
        $q(config.gc_percentage_id).html(Math.round(perc * 100));

    }

    /** high level functions END */

    function reverseComplementString(str) {
        var ret = '';
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (c == 'G') {
                c = 'C';
            } else if (c == 'g') {
                c = 'c';
            } else if (c == 'C') {
                c = 'G';
            } else if (c == 'c') {
                c = 'g';
            } else if (c == 'a') {
                c = 'u';
            } else if (c == 'A') {
                c = 'U';
            } else if (c == 'T') {
                c = 'A';
            } else if (c == 't') {
                c = 'a';
            } else if (c == 'u') {
                c = 'a';
            } else if (c == 'U') {
                c = 'A';
            }
            ret = c + ret;
        }
        return ret;
    }

    function load_sequence() {
        $.ajax({
            url: config.sequence,
            success: function (data) {
                $q(config.sequence_id).val(data).trigger('change');
            }
        });
    }

    function decode(sequence, minlen) {
        var ret = {};
        for (var f = 0; f < 3; f++) {
            ret[f] = {};
            var lastStop = 0;
            var foundStop = false;
            for (var bpi = f; bpi < sequence.length; bpi += 3) {
                var str = sequence.substring(bpi, bpi + 3);
                var codon = CodonMap[str];
                if (codon == 'STOP') {
                    if ((bpi - lastStop) >= (minlen * 3)) {
                        var range = {
                            from: lastStop,
                            to: bpi
                        };
                        for (var dec = lastStop; dec <= bpi; dec++) {
                            ret[f][dec] = range;
                        }
                    }
                    lastStop = bpi;
                    foundStop = true;
                } else if (!foundStop && codon == 'MET') {
                    lastStop = bpi;
                    foundStop = true;
                }
            }
        }
        return ret;
    }


    function recalculate() {
        console.info("Sequence Changed - recalculate");
        sequence = trim($(this).val());
        decodedForward = decode(sequence, config.initial_minimal_orf_legth);
        decodedReverse = decode(reverseComplementString(sequence), config.initial_minimal_orf_legth);

        if (config.show_slider) {
            var scrollbar = $('#' + config.slider_id)
            var canvas = $('#' + config.canvas_id);
            var canvasWidth = canvas.width();
            var sequenceWidth = (1 + sequence.length) * basepairWidth;
            var visible = canvasWidth / sequenceWidth;
            if (visible > 1) {
                visible = 1;
            }
            var newWidth = Math.round(visible * scrollbar.width());
            if (newWidth < 1) {
                newWidth = 1;
            }
            scrollbar.slider('option', 'min', 0);
            scrollbar.slider('option', 'max', Math.round(sequence.length - canvasWidth / basepairWidth));
            scrollbar.slider('option', 'value', sequence.length / 4);
            sliderValue = sequence.length / 4;

        }
        paint(sequence);
    }

    function canvas_click(x, y, origin) {
        if (y <= 100) {
            // click on the whole sequence view
            var canvas = document.getElementById(config.canvas_id);
            var width = canvas.width;
            var bpi = Math.round((sequence.length - width / basepairWidth) * x / width);
            if (bpi < 0) {
                bpi = 0;
            }
            if (bpi > sequence.length) {
                bpi = sequence.length;
            }
            console.info("Canvas click on BPI: " + bpi);
            sliderValue = bpi;
            paint(sequence);
        } else if (y >= 100 && origin == null) {
            // click to decode
            var steps = Math.round(x / basepairWidth);
            var bpi = sliderValue + steps - 1;
            var row = Math.ceil((y - 135) / aminoacidHeight);
            if (row >= 1 && row <= 3) {
                var range = decodedForward[row - 1][bpi];
                var putativeORF = {
                    from: range.from,
                    to: range.to,
                    forward: true
                };
                decode_putative_ORF(putativeORF);
                console.info("decode forward on bpi: " + bpi + " row:" + row + " " + range.from + "-" + range.to);
            } else if (row >= 5 && row <= 7) {
                var range = decodedReverse[row - 5][sequence.length - bpi];
                var putativeORF = {
                    from: range.from,
                    to: range.to,
                    forward: false
                };
                decode_putative_ORF(putativeORF);
                console.info("decode reverse on bpi: " + bpi + " row:" + row + " " + range.from + "-" + range.to);

            }
        } else if (y >= 100 && origin != null) {
            // drag to scroll
            var slide = x - origin.x;
            if (Math.abs(slide) > basepairWidth) {
                var steps = Math.round(slide / basepairWidth);
                origin.x += steps * basepairWidth;
                var scrollbar = $('#scrollbar');
                sliderValue = sliderValue - steps;
                scrollbar.slider('option', 'value', sliderValue);
                paint(sequence);
            }
        }
        console.info("Canvas click " + x + " " + y + " " + origin);
    }

    function decode_putative_ORF(putativeORF) {
        if (putativeORF.from && putativeORF.to) {
            var from = putativeORF.from;
            var to = putativeORF.to;
            var forward = putativeORF.forward;

            if (!forward) {
                sequence = reverseComplementString(sequence);
            }

            var decoded = '';
            for (var bpi = from + 3; bpi < to; bpi += 3) {
                var str = sequence.substring(bpi, bpi + 3);
                var codon = CodonMap[str];

                if (config.initial_letter_code_type != 3) {
                    decoded += AminoAcids[codon].shortName;
                } else {
                    decoded += codon + ' ';

                }
            }
            orf = {
                from: from,
                to: to,
                forward: forward,
                decoded: decoded
            };
            if (config.show_putative_orf) {
                $q(config.putative_orf_id).html(decoded);
            }

        }
    }

    function initialize_UI() {
        parseAminoAcids();

        var element = $('#' + config.element_id);
        element.off('change', '#' + config.sequence_id);

        var html = '';
        var closures = [];
        if (config.show_input_sequence_title) {
            html += "<span class='StarX_StarORF_input_sequence_title'>Input sequence</span><br>";
        }
        if (config.show_input_sequence) {
            html += "<textarea class='StarX_StarORF_input_sequence_textarea' id='" + config.sequence_id + "' style='width:100%;height:200px;border-width:1px, border-color:black'></textarea>";
            closures.push(function () {
                element.on('keypress', '#' + config.sequence_id, recalculate);
            });
        } else {
            html += "<input class='StarX_StarORF_input_sequence_hidden' id='" + config.sequence_id + "' type='hidden'>";
        }
        if (config.show_sequence_length) {
            html += "<span class='StarX_StarORF_input_sequence_length'>Sequence length is <span id='" + config.length_id + "'>0</span> bp.</span>";
            closures.push(function () {
                element.on('change', '#' + config.sequence_id, function () {
                    $q(config.length_id).html($(this).val().length);
                });
            })
        }
        if (config.show_gc_percentage) {
            html += "<span class='StarX_StarORF_input_sequence_gc_percentage'>Percentage of GC is <span id='" + config.gc_percentage_id + "'>0</span>%.</span>"
            closures.push(function () {
                element.on('change', '#' + config.sequence_id, calculate_gc_content);
            })
        }
        if (config.show_minimal_orf_length) {
            html += "<span class='StarX_StarORF_input_sequence_minimal_length'>Current minimal ORF length is <span id='" + config.minimal_orf_length_id + "'>" + config.initial_minimal_orf_legth + "</span> bp.</span>"
        }
        if (config.show_minimal_orf_length_button) {
            html += "<button id='" + config.minimal_orf_length_button_id + "' class='StarX_StarORF_input_sequence_minimal_length_button'>Change ORF Length</button>";
            closures.push(function () {
                $q(config.minimal_orf_length_button_id).button();
                element.on('click', '#' + config.minimal_orf_length_button_id, function () {
                    var newLength = Math.round(prompt("Minimum ORF length: ", "" + config.initial_minimal_orf_legth));
                    if (newLength > 0 && newLength < 10000) {
                        config.initial_minimal_orf_legth = newLength;
                        $('#' + config.minimal_orf_length_id).text(newLength);
                        $q(config.sequence_id).trigger('change');
                    }
                });
            })
        }
        if (config.show_reverse_complement) {
            html += "<button id='" + config.reverse_complement_id + "' class='StarX_StarORF_reverse_complement_button'>Reverse Complement</button>";
            closures.push(function () {
                $q(config.reverse_complement_id).button().click(reverse_complement);
            });
        }
        if (config.show_calculate_all_orfs) {
            html += "<button id='" + config.calculate_all_orfs_id + "' class='StarX_StarORF_calculate_all_orfs_button'>Calculate all ORFs</button>";
            closures.push(function () {
                $q(config.calculate_all_orfs_id).button().click(calculate_all_orfs);
            });
        }
        if (config.show_3_1_letter_code_toggle) {
            html += "<input type='checkbox' id='" + config.toggle_3_1_letter_code_id + "' class='StarX_StarORF_toggle_3_1_letter_code'/><label style='font-size:10px' for='" + config.toggle_3_1_letter_code_id + "' class='StarX_StarORF_toggle_3_1_letter_code'>3 letter code</label>";
            closures.push(function () {
                var set_toggle = function () {
                    config.initial_letter_code_type = this.checked ? 1 : 3;
                    if (config.initial_letter_code_type == 3) {
                        $q(config.toggle_3_1_letter_code_id).button('option', 'label', '3 letter code');
                    } else {
                        $q(config.toggle_3_1_letter_code_id).button('option', 'label', '1 letter code');
                    }
                    decode_putative_ORF(orf);
                };
                $q(config.toggle_3_1_letter_code_id).button().click(set_toggle);
                set_toggle();
            });
        }
        html += "<canvas id='" + config.canvas_id + "' class='canvas' style='width:100%; height:300px; border-color:black; border-width:1px;border-style:solid;display:block;' width=1000 height=300></canvas>";
        closures.push(function () {
            var orig;
            element.on('click', '#' + config.canvas_id, function (e) {
                var canvas = this;
                var x = (e.pageX - canvas.offsetLeft);
                var y = (e.pageY - canvas.offsetTop);
                canvas_click(x, y, null);
            });
            element.on('mousedown', '#' + config.canvas_id, function (e) {
                var canvas = this;
                orig = {
                    x: (e.pageX - canvas.offsetLeft),
                    y: (e.pageY - canvas.offsetTop)
                }
                return false;
            });
            element.on('mouseup', '#' + config.canvas_id, function (e) {
                orig = null;
                return false;
            });
            element.on('mousemove', '#' + config.canvas_id, function (e) {
                if (orig != null) {
                    var canvas = this;
                    var x = (e.pageX - canvas.offsetLeft);
                    var y = (e.pageY - canvas.offsetTop);
                    canvas_click(x, y, orig);
                }
            });

        });
        closures.push(function () {
            element.on('change', '#' + config.sequence_id, recalculate);
        });

        if (config.show_slider) {
            html += "<div id='" + config.slider_id + "'></div>";
            closures.push(function () {
                var slider = $q(config.slider_id);
                slider.slider();
                slider.slider('option', 'slide', function (e) {
                    var value = $(this).slider('option', 'value');
                    sliderValue = value;
                    paint(sequence);
                });
            })
        }
        if (config.show_putative_orf) {
            html += "<textarea id='" + config.putative_orf_id + "' style='width:100%;height:100;'></textarea>";
        }
        if (config.show_blast_putative_orf) {
            html += "<button id='" + config.blast_putative_orf_id + "'>Blast</button>";
            closures.push(function () {
                $q(config.blast_putative_orf_id).button().click(function () {
                    var link = 'http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&QUERY=' + orf.decoded;
                    window.open(link, 'blast');
                });
            })
        }
        if (config.show_calculate_all_orfs) {
            html += "<div id='" + config.all_orfs_id + "'></div>";
            closures.push(function () {
                element.on('change', '#' + config.sequence_id, function () {
                    $q(config.all_orfs_id).html('');
                });
            })
        }
        $(element).html(html);

        closures.push(load_sequence);

        $(closures).each(function () {
            this();
        });
    }

    /* painting */

    var baselineSequence = null;
    var baselineLength = 0;
    var baselineImage = null;
    var basepairWidth = 12;
    var aminoacidHeight = 15;


    function paint(sequence) {
        var canvas = document.getElementById(config.canvas_id);
        var width = canvas.width;
        var height = canvas.height;
        if (width != canvas.clientWidth) {
            canvas.width = canvas.clientWidth;
            width = canvas.width;
            baselineImage = null;
        }
        var g = canvas.getContext('2d');

        clearCanvas(canvas, width, height, g);
        if (sequence != baselineSequence || baselineLength != config.initial_minimal_orf_legth || baselineImage == null) {
            paintWholeSequence(sequence, canvas, width, height, g);
            baselineImage = g.getImageData(0, 0, width, height);
            baselineSequence = sequence;
            baselineLength = config.initial_minimal_orf_legth;
        } else {
            g.putImageData(baselineImage, 0, 0);
        }
        var from = Math.round(sliderValue / 10) * 10;
        var to = Math.round((sliderValue + width / basepairWidth) / 10) * 10;
        // paint selector window
        g.fillStyle = 'rgba(0,0,0,.5)';
        g.fillRect(from / sequence.length * width, 5, (from - to) / sequence.length * width, 70);
        g.fillStyle = '#000000';
        g.beginPath();
        g.moveTo(0, 100);
        g.lineTo(from / sequence.length * width, 75);
        g.moveTo(to / sequence.length * width, 75);
        g.lineTo(width, 100);
        g.stroke();
        g.closePath();

        // paint numbers
        g.font = 'bold 12px verdana';
        for (var bpi = from; bpi <= to; bpi += 10) {
            var w = g.measureText(bpi).width;
            g.fillText(bpi, (bpi - sliderValue) * basepairWidth - (w - basepairWidth) / 2, 110);
            g.fillText(bpi, (bpi - sliderValue) * basepairWidth - (w - basepairWidth) / 2, 270);
            g.fillRect((bpi - sliderValue) * basepairWidth, 113, basepairWidth, 5);
            g.fillRect((bpi - sliderValue) * basepairWidth, 254, basepairWidth, 5);

        }
        g.font = 'normal 12px verdana';

        // paint basepairs
        var w = g.measureText('A').width;
        for (var pos = sliderValue; pos <= Math.round((sliderValue + width / basepairWidth)); pos++) {
            var c = sequence.charAt(pos);
            g.fillText(c, (pos - sliderValue) * basepairWidth - (w - basepairWidth) / 2, 130);
            var c2 = complementChar(c);
            g.fillText(c2, (pos - sliderValue) * basepairWidth - (w - basepairWidth) / 2, 252);
        }

        g.lineWidth = .25;
        // paint lines
        g.beginPath();
        for (var step = 0; step <= 7; step++) {
            g.moveTo(0, 135 + 15 * step);
            g.lineTo(width, 135 + 15 * step);
        }
        for (var bpi = from - 3; bpi <= to; bpi += 1) {
            var step = bpi % 3;
            g.moveTo((bpi - sliderValue) * basepairWidth, 135 + step * aminoacidHeight);
            g.lineTo((bpi - sliderValue) * basepairWidth + 3, 142 + step * aminoacidHeight);
            g.lineTo((bpi - sliderValue) * basepairWidth, 150 + step * aminoacidHeight);

            g.moveTo((bpi - sliderValue) * basepairWidth, 195 + step * aminoacidHeight);
            g.lineTo((bpi - sliderValue) * basepairWidth - 3, 202 + step * aminoacidHeight);
            g.lineTo((bpi - sliderValue) * basepairWidth, 210 + step * aminoacidHeight);
        }
        g.stroke();
        g.closePath();

        function paintStopCodon(codon, step, bpi, dir) {
            if (codon == 'STOP') {
                var x0 = (bpi - sliderValue) * basepairWidth;
                var y0 = 135 + step * 15;
                g.beginPath();
                g.moveTo(x0, y0);
                g.lineTo(x0 + 3 * basepairWidth, y0);
                g.lineTo(x0 + 3 * basepairWidth + 3 * dir, y0 + 7);
                g.lineTo(x0 + 3 * basepairWidth, y0 + aminoacidHeight);
                g.lineTo(x0, y0 + 15);
                g.lineTo(x0 + 3 * dir, y0 + 7);
                g.fill();
                g.closePath();
            }
        }

        function paintStartCodon(codon, step, bpi, dir) {
            if (codon == 'Met') {
                var x0 = (bpi - sliderValue) * basepairWidth;
                var y0 = 135 + step * 15;
                g.beginPath();
                g.moveTo(x0, y0);
                g.lineTo(x0 + 3 * basepairWidth, y0);
                g.lineTo(x0 + 3 * basepairWidth + 3 * dir, y0 + 7);
                g.lineTo(x0 + 3 * basepairWidth, y0 + aminoacidHeight);
                g.lineTo(x0, y0 + 15);
                g.lineTo(x0 + 3 * dir, y0 + 7);
                g.fill();
                g.closePath();
            }
        }

        var oldFillStyle = g.fillStyle;
        g.fillStyle = '#008000';
        for (var bpi = ((from > 3 ) ? from - 3 : 0); bpi <= to; bpi += 1) {
            var step = bpi % 3;
            if (typeof (decodedForward[step][bpi]) == 'object') {
                var x0 = (bpi - sliderValue) * basepairWidth;
                var y0 = 135 + step * 15 + 4;
                g.fillRect(x0, y0, basepairWidth * 3, basepairWidth / 2);
            }
            if (typeof (decodedReverse[step][sequence.length - bpi]) == 'object') {
                var x0 = (bpi - sliderValue) * basepairWidth;
                var y0 = 135 + (step + 4) * 15 + 4;
                g.fillRect(x0, y0, basepairWidth * 3, basepairWidth / 2);
            }

        }

        g.fillStyle = '#ff0000';
        for (var bpi = ((from > 3 ) ? from - 3 : 0); bpi <= to; bpi += 1) {
            var step = bpi % 3;
            var str = sequence.substring(bpi, bpi + 3);
            var codon = CodonMap[str];
            var codon2 = CodonMap[reverseComplementString(str)];
            paintStopCodon(codon, step, bpi, 1);
            paintStopCodon(codon2, step + 4, bpi, -1);
        }
        g.fillStyle = oldFillStyle;

        g.fillStyle = 'rgb(96,96,192)';
        for (var bpi = ((from > 3 ) ? from - 3 : 0); bpi <= to; bpi += 1) {
            var step = bpi % 3;
            var str = sequence.substring(bpi, bpi + 3);
            var codon = CodonMap[str];
            var codon2 = CodonMap[reverseComplementString(str)];
            paintStartCodon(codon, step, bpi, 1);
            paintStartCodon(codon2, step + 4, bpi, -1);
        }
        g.fillStyle = oldFillStyle;

        //draw Amino Acid text
        for (var bpi = from - 3; bpi <= to; bpi += 1) {
            var step = bpi % 3;
            var str = sequence.substring(bpi, bpi + 3);
            var codon = CodonMap[str];
            var codon2 = CodonMap[reverseComplementString(str)];
            var w = g.measureText(codon).width;
            var w2 = g.measureText(codon2).width;
            g.fillText(codon, (bpi - sliderValue) * basepairWidth + 2 - (w - 3 * basepairWidth) / 2, 147 + step * aminoacidHeight);
            g.fillText(codon2, (bpi - sliderValue) * basepairWidth - 2 - (w2 - 3 * basepairWidth) / 2, 147 + 60 + step * aminoacidHeight);

        }

    }

    function paintWholeSequence(sequence, canvas, width, height, g) {
        if (decodedForward == null || decodedReverse == null) {
            return;
        }

        // paint whole sequence
        var oldFillStyle = g.fillStyle;
        g.fillStyle = '#e0e0e0';
        var h0 = 10;
        var h = 6;
        var step = 8;
        g.fillRect(0, h0 + 0 * step, width, h);
        g.fillRect(0, h0 + 1 * step, width, h);
        g.fillRect(0, h0 + 2 * step, width, h);

        g.fillRect(0, h0 + 3 * step + 1, width, h * 2);

        g.fillRect(0, h0 + 5 * step, width, h);
        g.fillRect(0, h0 + 6 * step, width, h);
        g.fillRect(0, h0 + 7 * step, width, h);

        var qq = sequence.length / width;
        var gc = 0;
        var qqc = 0;
        var pixel = 0;
        for (var i = 0; i < sequence.length; i++) {
            var c = sequence.charAt(i);
            if (c == 'g' || c == 'G' || c == 'c' || c == 'C') {
                gc++;
            }
            qqc++;
            if (qqc > qq) {
                var a = Math.round(256.0 - 256.0 * gc / qqc);
                g.fillStyle = 'rgb(' + a + ',' + a + ',' + a + ')';
                g.fillRect(pixel, h0 + 3 * step + 1, 1, h * 2);
                qqc = 0;
                gc = 0;
                pixel++;
            }
        }

        for (var band = 0; band < 3; band++) {
            var decodeMap = decodedForward[band];
            var isGreen = 0;
            var pixelIndex = 0;
            for (var bpi = band; bpi < sequence.length; bpi += 3) {
                pixelIndex += 3;
                var pt = decodeMap[bpi];
                if (typeof (pt) == 'object') {
                    isGreen++;
                }
                if (pixelIndex > qq) {
                    if (isGreen > 0) {
                        var pixel = Math.round(bpi / sequence.length * width);
                        if (isGreen == (pixelIndex / 3)) {
                            g.fillStyle = 'rgb(64,128,64)';
                        } else {
                            g.fillStyle = 'rgb(64,200,64)';

                        }
                        g.fillRect(pixel, h0 + band * step + 1, 1, h - 1);
                    }
                    isGreen = 0;
                    pixelIndex = 0;
                }
            }
        }

        for (var band = 0; band < 3; band++) {
            var decodeMap = decodedReverse[band];
            var isGreen = 0;
            var pixelIndex = 0;
            for (var bpi = band; bpi < sequence.length; bpi += 3) {
                pixelIndex += 3;
                var pt = decodeMap[bpi];
                if (typeof (pt) == 'object') {
                    isGreen++;
                }
                if (pixelIndex > qq) {
                    if (isGreen > 0 && isGreen == (pixelIndex / 3)) {
                        var pixel = Math.round(bpi / sequence.length * width);
                        g.fillRect(width - pixel, h0 + (5 + band) * step + 1, 1, h - 1);
                    }
                    isGreen = false;
                    pixelIndex = 0;
                }
            }
        }
        g.fillStyle = oldFillStyle;

    }

    function clearCanvas(canvas, width, height, g) {
        g.clearRect(0, 0, width, height);
        g.fillStyle = '#f0f0f0';
        g.fillRect(0, 0, width, 100);
    }

    // calculate all orfs
    function calculate_all_orfs() {
        var html = '';
        var rf = calculate_all_orfs_one_direction(sequence);
        var rb = calculate_all_orfs_one_direction(reverseComplementString(sequence));
        html += '<div style="background-color:rgb(225,255,225);font-weight:bold;font-size:18px;">Forward decoding</div><div style="width:100%;word-break:break-all">';
        for (i in rf) {
            var item = rf[i];
            var link = 'http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&QUERY=' + item.l1;
            html += "<span style='width:600px'><b>Forward " + item.from + "-" + item.to + "</b></span> <a class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' target='blast' style='height:20px;width:125px' href='" + link + "'><span  style='font-size:12px;width:50px'> Run Blast search </span></a><br>" + ( config.initial_letter_code_type == 3 ? item.l3 : item.l1) + "<br>";
        }
        html += '</div>';
        html += '<div style="background-color:rgb(225,255,225);font-weight:bold;font-size:18px;">Reverse decoding</div><div style="width:100%;word-break:break-all">';

        for (i in rb) {
            var item = rb[i];
            var link = 'http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&QUERY=' + item.l1;
            html += "<span style='width:600px'><b>Reverse " + item.from + "-" + item.to + "</b></span> <a class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' target='blast' style='height:20px;width:125px' href='" + link + "'><span  style='font-size:12px;width:50px'> Run Blast search </span></a><br>" + ( config.initial_letter_code_type == 3 ? item.l3 : item.l1) + "<br>";
        }
        $q(config.all_orfs_id).html(html);
    }

    function calculate_all_orfs_one_direction(sequence) {
        var ret = [];
        for (var f = 0; f < 3; f++) {
            var lastStop = 0;
            var foundStop = false;
            for (var bpi = f; bpi < sequence.length; bpi += 3) {
                var str = sequence.substring(bpi, bpi + 3);
                var codon = CodonMap[str];
                if (codon == 'STOP') {
                    if ((bpi - lastStop) >= (config.initial_minimal_orf_legth * 3)) {
                        var from = lastStop;
                        var to = bpi;
                        var l1 = '';
                        var l3 = '';
                        for (var bpi = from + 3; bpi < to; bpi += 3) {
                            var str = sequence.substring(bpi, bpi + 3);
                            var codon = CodonMap[str];
                            l1 += AminoAcids[codon].shortName;
                            l3 += codon + ' ';
                        }
                        ret.push({
                            from: lastStop,
                            to: bpi,
                            l3: l3,
                            l1: l1
                        });
                    }
                    lastStop = bpi;
                    foundStop = true;
                } else if (!foundStop && codon == 'MET') {
                    lastStop = bpi;
                    foundStop = true;
                }
            }
        }
        return ret;
    }

    return {
        configure: function (config) {
            parse_config(config);
            initialize_UI();
            console.info("StarORF/main.js");
        }
    };
})