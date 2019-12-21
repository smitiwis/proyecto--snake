//VARIABLES GLOBALES
var velocidad = 200;
var tamano = 20;
// creamos una clase abstracta por si decirlo donde estaran almacenados todos los OBJETOS
class objeto {
    constructor() {
        this.tamano = tamano;
    }
    // funcion de deteccion de coliciones
    choque(obj) {
        var difx = Math.abs(this.x - obj.x);
        var dify = Math.abs(this.y - obj.y);
        if (difx >= 0 && difx < tamano && dify >= 0 && dify < tamano) {
            return true;
        } else {
            return false;
        }
    }
}
class Cola extends objeto {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;

        this.siguiente = null;
    }
    dibujar(ctx) {
        if (this.siguiente != null) {
            this.siguiente.dibujar(ctx);
        }
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
    setxy(x, y) {
        if (this.siguiente != null) {
            this.siguiente.setxy(this.x, this.y);
        }
        this.x = x;
        this.y = y;
    }
    meter() {
        if (this.siguiente == null) {
            this.siguiente = new Cola(this.x, this.y);
        } else {
            this.siguiente.meter();
        }
    }
    versiguiente() {
        return this.siguiente;
    }
}
class Comida extends objeto {
    constructor() {
        super();
        this.x = this.generarX();
        this.y = this.generarY();
    }

    generarX() {
        var num = (Math.floor(Math.random() * 15)) * 20;
        return num;
    }
    generarY() {
        var num = (Math.floor(Math.random() * 20)) * 20;
        return num;
    }
    colocar() {
        this.x = this.generarX();
        this.y = this.generarY();
    }
    dibujar(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
}
// objetos del juego
var cabeza = new Cola(20, 20);
var comida = new Comida();
var ejex = true,
    ejey = true,
    xdir = 0,
    ydir = 0;
function movimiento() {
    var nx = cabeza.x + xdir;
    var ny = cabeza.y + ydir;
    cabeza.setxy(nx, ny);
}
// movimiento del gusano
// si me muevo en el eje x ya no puedo seguir moviendome en el mismo eje
// pero si deberia en el otro eje
function control(event) {
    var cod = event.key;
    if (ejex) {
        if (cod == "w") {
            ydir = -tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
        if (cod == "s") {
            ydir = tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
    }
    if (ejey) {
        if (cod == "a") {
            ydir = 0;
            xdir = -tamano;
            ejey = false;
            ejex = true;
        }
        if (cod == "d") {
            ydir = 0;
            xdir = tamano;
            ejey = false;
            ejex = true;
        }
    }
}
function finJuego() {
    xdir = 0;
    ydir = 0;
    ejex = true;
    ejey = true;
    cabeza = new Cola(20, 20);
    comida = new Comida();
    alert("Perdiste");
}
function choquepared() {
    if (cabeza.x < 0 || cabeza.x > 300 || cabeza.y < 0 || cabeza.y > 400) {
        finJuego();
    }
}
function choquecuerpo() {
    var temp = null;
    try {
        temp = cabeza.versiguiente().versiguiente();
    } catch (err) {
        temp = null;
    }
    while (temp != null) {
        if (cabeza.choque(temp)) {
            //fin del juego
            finJuego();
        } else {
            temp = temp.versiguiente();
        }
    }

}

function dibujar() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    // CON ESTE CODIGO ES DE LIMPIEZA
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cabeza.dibujar(ctx);
    comida.dibujar(ctx);
    //AQUI VAN TODOS LOS DIBUJO
}
function main() {
    choquecuerpo();
    choquepared();
    dibujar();
    movimiento();
    if (cabeza.choque(comida)) {
        comida.colocar();
        cabeza.meter();
    }

}

setInterval("main()", velocidad);
