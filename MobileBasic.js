/*
 * ================================//
 * Интерпретатор языка JsMobileBasic
 * ~~~~~~~~~~by PROPHESSOR~~~~~~~~~~
 * ================================//
 */

/* global $Config */

'use strict';

//Графика

const JsMB = {
    $Mouse: {
        x: 0,
        y: 0,
        lcount: 0,
        rcount: 0
    },
    $Gel: {
        $Sprite: {}
    },
    $Font: {
        family: 'arial',
        size: '10'
    },
    $Element: {},
    $Menu: {
        $Bar: {}
    },
    $JsMobileBasic: {
        name: 'JsMobileBasic',
        version: 'Alpha 11',
        author: 'PROPHESSOR',
        url: 'http://vk.com/JsMobileBasic',
        Mobile: $Config.Mobile,
        Debug: true,
        canvas: typeof document !== 'undefined' ? document.getElementById('c') : null,
        graphic: false
    },

    PI: Math.PI,
    G: 9.8,
    RAD2DEG: 180 / this.PI,
    DEG2RAD: this.PI / 180,

    __preinit(){
        for(const i in this) {
            if(typeof this[i] === 'function') this[i] = this[i].bind(this);
        }
    },

    __init({canvas, div}) {
        if (typeof require !== "function") window.require = () => console.warn("Использование системных функций не поддерживается на Вашей платформе");

        this.$NW = {};
        this.$Path = {};
        this.$Proc = {};
        if (typeof require === "function") {
            try {
                this.$NW = require("nw.gui");
            }catch(e){
                this.$NW = null; 
            }
        } else this.$NW = null;

        this.debug('#===== Включён режим отладки =====#', 'color:gray;');
        this.debug(this.$JsMobileBasic.name, 'background:gray;color:yellow;');
        this.debug("v. " + this.$JsMobileBasic.version, 'background:gray;color:yellow;');
        this.debug("by " + this.$JsMobileBasic.author, 'background:gray;color:yellow;');
        this.debug(this.$JsMobileBasic.url, 'background:gray;color:yellow;');

        // ======Инициализация рабочей среды======//
        this.debug('// ======Инициализация рабочей среды======//', 'color:gray;');
        // Чтение конфига
        if (typeof $Config == "undefined") {
            console.error('Не найден файл конфигурации!');
        }

        if ($Config.type == 'graphic') {
            this.$JsMobileBasic.graphic = true;
            this.debug('Используется графика!', 'background:black;color:yellow;');

            this.$JsMobileBasic.$style = document.createElement('style');
            this.$JsMobileBasic.$style.innerHTML = 'html{overflow: hidden;} body{margin:0;padding:0;}';
            document.head.appendChild(this.$JsMobileBasic.$style);

            this.c = canvas;
            //    this.$JsMobileBasic.canvas = this.c;
            this.ctx = this.c.getContext("2d");
            if ($Config.canvas_size[0] == '*' && $Config.canvas_size[1] == '*') {
                this.debug('Canvas растянут на весь экран', 'background:black;color:#00ff00;');
                if (!this.$JsMobileBasic.Mobile) {
                    $Config.canvas_size[2] ? this.debug('Вмещение включено') : this.debug('Вмещение выключено');
                }
                this.c.height = window.innerHeight;
                this.c.width = window.innerWidth;
                if ($Config.canvas_size[2]) {
                    this.c.style = 'display:block; margin:0; padding:0; position:fixed; top:0px; left: 0px; width:100%; height:100%;';
                }
            } else {
                // this.debug(this.$Config.canvas_size);
                this.c.height = $Config.canvas_size[1];
                this.c.width = $Config.canvas_size[0];
            }
        } else {
            this.debug('Графика не используется!', 'background:black;color:yellow;');
            this.c = typeof window !== 'undefined' ? window : null;
            this.ctx = false;
            if (typeof document !== 'undefined' && document.getElementById('c') !== undefined)          document.body.removeChild(document.getElementById('c'));
        }

        if (typeof document !== 'undefined') document.getElementsByTagName('title')[0].innerHTML = $Config.name;
        this.debug('Имя проекта: ' + $Config.name, 'background:brown;color:yellow;');

        this.$Player = [typeof document !== 'undefined' ? document.getElementById("player0") : {}];

        this.debug('// ======Инициализация интерпретатора======//', 'color:gray;');

    },

    setColor(color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        return this;
    },

    setLineWidth(width) {
        this.ctx.lineWidth = width;
        return this;
    },

    fillRect(x, y, x1, y1) {
        this.ctx.fillRect(x, y, x1, y1);
        return this;
    },

    cls() {
        this.clearRect(0, 0, this.screenWidth(), this.screenHeight());
        document.getElementById('p').innerHTML = '';
        return this;
    },

    fillScreen(color) {
        this.ctx.save();
        this.setColor(color);
        this.fillRect(0, 0, this.screenWidth(), this.screenHeight());
        this.ctx.restore();
        return this;
    },

    drawRect(x, y, x1, y1) {
        this.ctx.strokeRect(x, y, x1, y1);
        return this;
    },

    drawPlot(x, y) {
        this.ctx.save();
        this.setLineWidth(1);
        this.drawLine(x, y, x + 1, y + 1);
        this.ctx.restore()
        return this;
    },

    clearRect(x, y, x1, y1) {
        this.ctx.clearRect(x, y, x1, y1);
        return this;
    },

    drawLine(x, y, x1, y1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x1, y1)
        this.ctx.stroke();
        return this;
    },

    drawCube(x, y, x1, y1, q) {
        this.ctx.strokeRect(x, y, x1, y1);
        this.ctx.strokeRect(x + (q / Math.sqrt(2)), y + (q / Math.sqrt(2)), x1, y1);
        this.drawLine(x, y, x + (q / Math.sqrt(2)), y + (q / Math.sqrt(2)));
        this.drawLine(x + x1, y, x + x1 + (q / Math.sqrt(2)), y + (q / Math.sqrt(2)));
        this.drawLine(x, y + y1, x + (q / Math.sqrt(2)), y + y1 + (q / Math.sqrt(2)));
        this.drawLine(x + x1, y + y1, x + x1 + (q / Math.sqrt(2)), y + y1 + (q / Math.sqrt(2)));
        return this;
    },

    drawArc(x, y, radius,
        startAngle = (15 * Math.PI / 7),
        endAngle = (13 * Math.PI / 2),
        counterClockwise = false) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        this.ctx.stroke();
        return this;
    },

    fillArc(x, y, radius,
        startAngle = (15 * Math.PI / 7),
        endAngle = (13 * Math.PI / 2),
        counterClockwise = false) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        this.ctx.fill();
        return this;
    },

    fillRect4(x, y, x1, y1, x2, y2, x3, y3) {
        const arr = [
            [x, y],
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ];
        this.ctx.beginPath();
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) this.ctx.moveTo(arr[i][0], arr[i][1]);
            else this.ctx.lineTo(arr[i][0], arr[i][1]);
        }
        this.ctx.fill();
        return this;
    },

    drawRect4(x, y, x1, y1, x2, y2, x3, y3) {
        const arr = [
            [x, y],
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ];
        this.ctx.beginPath();
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) this.ctx.moveTo(arr[i][0], arr[i][1]);
            else this.ctx.lineTo(arr[i][0], arr[i][1]);
        }
        this.ctx.stroke();
        return this;
    },

    fillTriangle(x, y, x1, y1, x2, y2) {
        const arr = [
            [x, y],
            [x1, y1],
            [x2, y2]
        ];
        this.ctx.beginPath();
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) this.ctx.moveTo(arr[i][0], arr[i][1]);
            else this.ctx.lineTo(arr[i][0], arr[i][1]);
        }
        this.ctx.fill();
        return this;
    },

    drawTriangle(x, y, x1, y1, x2, y2) {
        const arr = [
            [x, y],
            [x1, y1],
            [x2, y2]
        ];
        this.ctx.beginPath();
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) this.ctx.moveTo(arr[i][0], arr[i][1]);
            else this.ctx.lineTo(arr[i][0], arr[i][1]);
        }
        this.ctx.stroke();
        return this;
    },

    drawString(text, x, y) {
        this.ctx.fillText(text, x, y);
        return this;
    },

    setFontSize(size) {
        this.ctx.font = size + "px " + this.$Font.family;
        this.$Font.size = size;
        return this;
    },

    setFont(family) {
        this.ctx.font = this.$Font.size + "px " + family;
        this.$Font.family = family;
        return this;
    },

    makeLinearGradient(x, y, x1, y1) {
        return this.ctx.createLinearGradient(x, y, x1, y1);
    },

    makeRadialGradient(x, y, r, x1, y1, r1) {
        return this.ctx.createRadialGradient(x, y, r, x1, y1, r1);
    },

    setGradientColor(g, num, color) {
        g.addColorStop(num, color);
        return this;
    },

    //Конвертеры

    rgb(red = 0, green = 0, blue = 0) {
        return "rgb(" + red + "," + green + "," + blue + ")";
    },

    rgba(red = 0, green = 0, blue = 0, alpha = 0) {
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    },

    //Гели/спрайты

    gelLoad(file, name) {
        this.$Gel[name] = new Image();
        this.$Gel[name].src = file;
        return this;
    },

    spriteGel(file, name) {
        // $Gel.$Sprite[name] = new Sprite();
        // $Gel.$Sprite[name].src = file;
        this.debug('Внимание! Функция spriteGel работает некорректно! Обновитесь до последней версии!');
        return false;
        //    var this.c = new Sprite();

    },

    drawGel(name, x, y) {
        if (this.$Gel[name].resize == true) {
            this.ctx.drawImage(this.$Gel[name], x, y, this.$Gel[name].w, this.$Gel[name].h);
        } else {
            this.ctx.drawImage(this.$Gel[name], x, y);
        }
        return this;
    },

    drawSprite(name, x, y) {
        // this.ctx.drawImage($Gel[name],x,y);
        return false;
    },

    gelSize(name, w, h) {
        this.$Gel[name].resize = true;
        this.$Gel[name].w = w;
        this.$Gel[name].h = h;
        return this;
    },

    drawGelFragment(name, fx, fy, fw, fh, x, y, w = fw, h = fh) { //TODO: Проверить
        this.ctx.drawImage(this.$Gel[name], fx, fy, fw, fh, x, y, w, h);
        return this;
    },

    makeTexture(gelname, repeat = 'repeat') { //repeat/no-repeat
        return this.ctx.createPattern(this.$Gel[gelname], repeat);
    },


    //Ввод

    input(text) {
        return prompt(text);
    },


    //Вывод


    println(...text) {
        const p = document.getElementById('p');
        p.style = "position:fixed;top:0px;left:0px;width:100%;height:100%;-webkit-user-select:none;    pointer-events: none;";
        p.innerHTML += text + "<br/>";
        return this;
    },

    //Звук

    playSound(file, loop, channel = 0) {
        if (this.$Player[channel] === undefined) {
            const p = document.createElement('audio');
            p.id = "player" + channel;
            document.getElementById('audio').appendChild(p);
            this.$Player[channel] = document.getElementById('player' + channel);
        }
        this.$Player[channel].setAttribute("src", file);
        if (!loop) {
            this.$Player[channel].setAttribute('loop', '0');
            this.$Player[channel].play();
        } else {
            this.$Player[channel].setAttribute('loop', '1');
            this.$Player[channel].play();
        }
        return this;
    },

    pauseSound(channel = 0) {
        if (channel == -1) {
            for (const i in this.$Player) {
                this.$Player[i].pause();
            }
            return this;
        }
        if (this.$Player[channel] === undefined) {
            this.debug("На данном канале нет плеера");
            return false;
        }
        this.$Player[channel].pause();
        return this;
    },

    //Matheматика

    sqrt: Math.sqrt,

    random: (a, b) => Math.floor(Math.random() * b - a) + a,

    sin: Math.sin,

    cos: Math.cos,

    tan: Math.tan,

    ctg: (x) => 1 / Math.tan(x),

    asin: Math.asin,

    acos: Math.acos,

    atan: Math.atan,

    mod: (x, y) => x % y,

    abs: Math.abs,

    pow: Math.pow,

    ln: Math.log,

    exp: Math.exp,

    limit: (variable, a, b) => variable <= a ? a : b,

    min: Math.min,
    max: Math.max,

    rad: (deg) => {
        if (deg === 90) return this.PI / 2;
        if (deg === 270) return 3 * this.PI / 2;
        return deg * this.DEG2RAD;
    },

    deg: (rad) => rad * this.RAD2DEG,

    //Строковые функции
    len: (str) => str.length,

    str: (num) => num.toString(),

    val: (str) => Number(str),

    int: (str) => Number(str),

    upper: (str) => str.toUpperCase(),

    lower: (str) => str.toLowerCase(),

    mid: (str, pos, len) => str.substr(pos, len),

    chr: (code) => String.fromCharCode(code), //code to string

    asc: (str) => str.charCode, //string to code

    split: (str, char) => str.split(char),

    replace: (str, reg, to) => str.replace(reg, to),

    float: (str) => parseFloat(str),

    //Работа с локальными данными

    localSaveData(name, _data) {
        const data = typeof (_data) == "object" ? this.toJSON(_data) : _data;
        window.localStorage.setItem(name, data);
        return this;
    },

    localReadData(name) {
        try {
            return this.parseJSON(window.localStorage.getItem(name));
        } catch (e) {
            return window.localStorage.getItem(name);
        }
    },

    parseJSON: (json) => {
        try {
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    },

    toJSON: (object, f = null, s = 4) => JSON.stringify(object, f, 4),

    toPSON: (object, s) => JSON.stringify(object, (a,b)=>typeof b==='function'?''+b:b, s),

    //Работа с NW

    //Контекстное меню
    menuAdd(name, title, onClick, type, fortype) {
        if (this.$NW) {
            if (this.$Menu[name] == undefined) {
                this.$Menu[name] = new this.$NW.Menu();
            }
            switch (type) {
                case undefined:
                    this.$Menu[name].append(new this.$NW.MenuItem({
                        label: title,
                        click: onClick
                    }));
                    break;
                case 'subMenu':
                    this.$Menu[name].append(new this.$NW.MenuItem({
                        label: title,
                        submenu: fortype
                    }));
                    break;
                case 'checkbox':
                    this.$Menu[name].append(new this.$NW.MenuItem({
                        label: title,
                        type: 'checkbox',
                        click: onClick
                    }));
                    break;
            }
            return this;
        } else {
            this.debug('Создание меню невозможно!');
            return false;
        }
    },

    menuShow(name, x, y) {
        if (this.$NW) {
            this.$Menu[name].popup(x, y);
            return this;
        } else {
            this.debug('Отображение меню невозможно!');
            return false;
        }
    },

    menuAddSeparator(name) {
        if (this.$NW) {
            if (this.$Menu[name] == undefined) {
                this.$Menu[name] = new this.$NW.Menu();
            }
            this.$Menu[name].append(new this.$NW.MenuItem({
                type: 'separator'
            }));
            return this;
        } else {
            this.debug('Создание меню невозможно!');
            return false;
        }
    },

    //Menu bar

    menuBarAdd(name, title, subMenu) {
        if (this.$NW) {
            if (this.$Menu.$Bar[name] == undefined) {
                this.$Menu.$Bar[name] = new this.$NW.Menu({
                    type: 'menubar',
                    title: title
                });
            }
            this.$Menu.$Bar[name].append(new this.$NW.MenuItem({
                label: title,
                submenu: this.$Menu[subMenu]
            }));
            return this;
        } else {
            this.debug('Создание меню невозможно!');
            return false;
        }
    },

    menuBarShow(name) {
        if (this.$NW) {
            this.$NW.Window.get().menu = this.$Menu.$Bar[name];
            return this;
        } else {
            this.debug('Отображение меню невозможно!');
            return false;
        }
    },


    //clipboard

    getClipboard(type = 'text') {
        if (this.$NW) {
            const clipboard = this.$NW.Clipboard.get();
            return clipboard.get(type);
        } else {
            this.debug('Работа с буфером обмена невозможна!');
            return false;
        }
    },

    setClipboard(value, type = 'text') {
        if (this.$NW) {
            const clipboard = this.$NW.Clipboard.get();
            clipboard.set(value, type);
            return this;
        } else {
            this.debug('Работа с буфером обмена невозможна!');
            return false;
        }
    },

    clearClipboard() {
        if (this.$NW) {
            const clipboard = this.$NW.Clipboard.get();
            clipboard.clear();
            return this;
        } else {
            this.debug('Работа с буфером обмена невозможна!');
            return false;
        }
    },

    //tray

    menuTrayAdd(name, title, icon, menu) {
        if (this.$NW) {
            const tray = new this.$NW.Tray({
                title: title,
                icon: icon,
                alticon: icon
            });
            tray.menu = this.$Menu[menu];
            return this;
        } else {
            this.debug('Работа с треем невозможна!');
            return false;
        }
    },

    //Работа с модулями
    include: (file) => {
        const e = document.createElement("script");
        e.src = file;
        e.type = "text/javascript";
        document.getElementById('modules').appendChild(e);
        return this;
    },

    getModuleName(ID) {
        return ID.name;
    },

    getModuleAuthor(ID) {
        return ID.author;
    },

    getModuleDescription(ID) {
        return ID.description;
    },

    getModuleUrl(ID) {
        return ID.url;
    },

    getModuleVersion(ID) {
        return ID.version;
    },

    //Получение значений

    screenWidth() {
        if (this.$JsMobileBasic.graphic || this.$JsMobileBasic.canvas) {
            return this.$JsMobileBasic.canvas.width;
        } else {
            return window.innerWidth;
        }
    },

    screenHeight() {
        if (this.$JsMobileBasic.graphic || this.$JsMobileBasic.canvas) {
            return this.$JsMobileBasic.canvas.height;
        } else {
            return window.innerHeight;
        }
    },

    getMouseX() {
        return this.$Mouse.x;
    },

    getMouseY() {
        return this.$Mouse.y;
    },

    getLeftClicksCount() {
        return this.$Mouse.lcount;
    },

    getRightClicksCount() {
        return this.$Mouse.rcount;
    },


    //Техническое

    log(text) {
        console.log(text);
        return this;
    },

    debug(text, style = 'background: black; color: red;') {
        if ($Config.Debug_Mode) {
            if (!this.$JsMobileBasic.Mobile)
                console.log('%c ' + text, style);
            else
                alert(style);
        }
        return {
            next: this.debug
        };
    },

    exit() {
        window.close();
        return this;
    },

    fullScreen(mode) {
        if (this.$NW) {
            if (mode) {
                const tmp = this.$NW.Window.get();
                tmp.enterFullscreen();
            } else {
                const tmp = this.$NW.Window.get();
                tmp.leaveFullscreen();
            }
        } else {
            this.debug("Работа с процессами невозможна!");
            return false;
        }
    },

    addElement(name, type) {
        this.$Element[name] = document.createElement(type);
        document.getElementById('includeHTML').appendChild(name)
        return this.$Element[name];
    },

    //Обработчики событий
    _eventListeners() {
        // window.onClick =
        //     window.onMouseDown = window.onMouseMove = window.onMouseUp = window.onKeyDown = window.onKeyPress = window.onKeyUp = window.onRightClick = window.Loop = () => {};
        this.c.addEventListener('mousemove', (event) => {
            this.$Mouse.x = event.offsetX;
            this.$Mouse.y = event.offsetY;
            if (typeof onMouseMove === 'function')
                onMouseMove(event.offsetX, event.offsetY, event);
        }, false);
        this.c.addEventListener('click', (event) => {
            this.$Mouse.lcount++;
            if (typeof onClick === 'function')
                onClick(event.offsetX, event.offsetY, event);
        }, false);
        this.c.addEventListener('mousedown', (event) => {
            if (typeof onMouseDown === 'function')
                onMouseDown(event.offsetX, event.offsetY, event);
        }, false);
        this.c.addEventListener('mouseup', (event) => {
            if (typeof onMouseUp === 'function')
                onMouseUp(event.offsetX, event.offsetY, event);
        }, false);
        this.c.addEventListener('contextmenu', (event) => {
            this.$Mouse.rcount++;
            if (typeof onRightClick === 'function')
                onRightClick(event.offsetX, event.offsetY, event);
        }, false);
        window.addEventListener('keypress', (event) => {
            if (typeof onKeyPress === 'function')
                onKeyPress(event.keyCode, event);
        }, false);

        window.addEventListener('keydown', (event) => {
            if (typeof onKeyDown === 'function')
                onKeyDown(event.keyCode, event);
        }, false);

        window.addEventListener('keyup', (event) => {
            if (typeof onKeyUp === 'function')
                onKeyUp(event.keyCode, event);
        }, false);
    }
}
// ======Прочее======//

JsMB.__preinit();
if(typeof window !== 'undefined' && typeof document !== 'undefined') {
    Object.assign(window, JsMB);
    JsMB.__init({
        canvas: document.getElementById('c'),
        div: document.getElementById('p')
    });
}

if(typeof module === 'object') module.exports = JsMB;

JsMB.debug('// ======Инициализация завершена======//', 'background:black;color: #00ff00;');

if(typeof window !== 'undefined') window.addEventListener('load', function () {
    JsMB._eventListeners();
    if (typeof Main === "function") Main(); //eslint-disable-line
    else throw new Error("В файле Autorun.bas должен быть хук Main()!");
    if (typeof Loop === "function") {
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (fnc) {
                return window.setTimeout(fnc, 1000 / 60);
            });
        }

        function $Loop() {
            window.requestAnimationFrame($Loop);
            Loop();
        }
        $Loop();
    }
});

JsMB.debug('// ======Подключение модулей/библиотек======//', 'color:gray;');