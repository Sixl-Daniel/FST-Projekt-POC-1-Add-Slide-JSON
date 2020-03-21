// IMPORTS

import iro from '@jaames/iro';

// MISC

const l = console.log;

// CHANNEL 

const user = "Daniel Sixl";
const userId = 1;
const sliderTyp = 'basic';
const presentationId = 1;

// EDITOR

const toolbarOptions = [
    [{
        'header': [1, 2, 3, false]
    }],
    ['bold', 'italic', 'underline', 'strike'],
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    ['clean']
];

const quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});

// COLOR PICKER

const colors = {
    hex: '',
    rgb: '',
    hsl: '',
    rgbaString: '',
    rgba: '',
    hex8String: ''
}

const colorPickerTarget = document.querySelector('#color-picker-container-slide');
const colorPickerSample = document.querySelector('#color-picker-container-sample');
const colorPickerInput = document.querySelector('#input-color');
const inputErrorClassCss = 'is-danger';

const colorPickerOptions = {
    width: 300,
    color: "rgba(255, 255, 255, 0.80)",
    borderWidth: 1,
    borderColor: "#dbdbdb",
    layout: [{
            component: iro.ui.Wheel,
            options: {
                sliderType: 'hue'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'saturation'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'value'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'alpha'
            }
        }
    ]
}

const colorPicker = new iro.ColorPicker(colorPickerTarget, colorPickerOptions);

colorPickerInput.addEventListener("keyup", updateColorPicker);

function isValidHex8String(colorString) {
    regex = new RegExp("^#([A-Fa-f0-9]{8})$");
    return regex.test(colorString);
}

function updateColorPicker() {
    const colorString = colorPickerInput.value;
    if (isValidHex8String(colorString)) {
        colorPicker.color.hex8String = colorString;
        colorPickerInput.classList.remove(inputErrorClassCss);
    } else {
        colorPickerInput.classList.add(inputErrorClassCss);
    };
}

colorPicker.on(["color:init", "color:change"], function (color) {
    colors.hex = color.hexString;
    colors.rgb = color.rgbString;
    colors.hsl = color.hslString;
    colors.rgba = color.rgba;
    colors.rgbaString = color.rgbaString;
    colors.hex8String = color.hex8String;

    colorPickerSample.style.backgroundColor = colors.rgbaString;
    colorPickerInput.value = colors.hex8String;
});

// FORM

const formAddSlide = document.querySelector('#form-add-slide');
formAddSlide.addEventListener("submit", sendForm);

const jsonDemo = document.querySelector('#json-demo');

const presentation = {
    user: user,
    userId: userId,
    presentationId: presentationId,
    timestamp: Date.now(),
    date: new Date(),
    slides: []
};

let slideNumber = 0;

function sendForm(e) {

    e.preventDefault();

    slideNumber++

    presentation.timestamp = Date.now();
    presentation.date = new Date();

    const slide = {
        number: slideNumber,
        slideType: sliderTyp,
        backgroundImageUrl: formAddSlide.querySelector("#input-bg-url").value,
        content: formAddSlide.querySelector(".ql-editor").innerHTML,
        color: [{
                'hex': colors.hex
            },
            {
                'rgb': colors.rgb
            },
            {
                'hsl': colors.hsl
            },
            {
                'rgba': colors.rgba
            },
            {
                'rgbaString': colors.rgbaString
            },
            {
                'hex8String': colors.hex8String
            }
        ],
        colorScheme: formAddSlide.querySelector("#select-color-scheme").value
    };

    presentation.slides.push(slide);

    const jsonOutputString = JSON.stringify(presentation, null, "  ");

    console.group("VSPOT // JSON Output");
    l(jsonOutputString);
    console.groupEnd();

    jsonDemo.textContent = jsonOutputString;

    hljs.highlightBlock(jsonDemo);

}