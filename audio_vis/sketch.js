var song;
var amp;
var zgodovina = [];
var povprecje;
var counter = 0;
var fft;
var energija;
var renderer, scena, kamera, materialKocka, materialKnot, geometrijaKocka, geometrijaKnot, materialkocka2, Knot, kocka;
var kocka2;
var sestevek;
var stevec;
var composer;

document.addEventListener("keyup", toggleSong);

function preload(){
    song = loadSound("test.mp3");
}

function setup() {
    ustvariThree();
    noCanvas();
    
    fft = new p5.FFT();
    fft.setInput(song);
    

    ustvariKocko();
    ustvariKnot();

    
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scena.add( light );

    // postprocessing

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scena, kamera) );

    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 4;
    composer.addPass( effect );

    var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    effect.uniforms[ 'amount' ].value = 0.0015;
    effect.renderToScreen = true;
    composer.addPass( effect );

    


    amp = new p5.Amplitude();
    

}

function draw() {
    var spectrum = fft.analyze();
    energija = (fft.getEnergy("bass") + fft.getEnergy("lowMid"))/2;
    var vol = amp.getLevel();
    
    
    if(zgodovina.length > 500 ){
        zgodovina.splice(0,1);
    }
    
    
    if(energija > 0){
        zgodovina.push(energija);    
    }
    
    if(energija > povprecje()){

        rotiraj(kocka, energija / 20000);  
        rotiraj(Knot, - energija / 20000);
        glitch();
        

    } else {
        rotiraj(kocka, 0.001);  
        rotiraj(Knot, - 0.001);      
    }

    
    composer.render();
    
    stevec++;
}


function toggleSong(){
    if(song.isPlaying()){
        song.pause();
    } else{
        song.play();
    }
}



function ustvariThree() {
    scena = new THREE.Scene();
    kamera = new THREE.PerspectiveCamera(75,  window.innerWidth /  window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    scena.fog = new THREE.FogExp2(0x03544e, 1);
    //renderer.setClearColor(scena.fog.color);
    document.body.appendChild(renderer.domElement);
    
}

function ustvariKocko() {
    geometrijaKocka = new THREE.BoxGeometry( 1, 1, 1 );
    materialKocka = new THREE.MeshNormalMaterial({wireframe: false});
    materialKocka2 = new THREE.MeshBasicMaterial({wireframe: true, color: 0xFF0000});
    kocka = new THREE.Mesh(geometrijaKocka, materialKocka);
    scena.add(kocka);
    kamera.position.z = 3;     
}

function ustvariKnot() {
    geometrijaKnot = new THREE.TorusKnotBufferGeometry( 10, 3, 100, 32 );
    materialKnot = new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking, wireframe: true});
    Knot = new THREE.Mesh(geometrijaKnot, materialKnot);
    scena.add(Knot);
    kamera.position.z = 3;     
}

var rotiraj = function(predmet,hitrost){
    predmet.rotation.x += hitrost;
    predmet.rotation.y += hitrost;
    predmet.rotation.z += hitrost;
}

function povprecje(){
    sestevek = 0;
    for(var i = 0; i < zgodovina.length;i++){
        sestevek += zgodovina[i];
    }
    var povprecje = sestevek / zgodovina.length;
    return povprecje;
}

function glitch() {
    var rand1 = Math.floor(Math.random() * 100);
    var rand2 = Math.floor(Math.random() * 3);
    if(scena.getObjectByName("kocka2") == undefined){
        
        if(rand1 < 3){    
        kocka2 = new THREE.Mesh(geometrijaKocka, materialKocka2);
        kocka2.rotation.x = kocka.position.x * 200;
        kocka2.rotation.y = kocka.position.y * 200;
        kocka2.rotation.z = kocka.position.z * 200;
        kocka2.position.x = rand2;
        kocka2.position.y = rand2;
        kocka2.position.z = rand2;
        scena.add(kocka2);
        kocka2.name = "kocka2";
        }
    } else {  
        if(rand1 > 70){
            scena.remove(kocka2); 
        }
    }
}

