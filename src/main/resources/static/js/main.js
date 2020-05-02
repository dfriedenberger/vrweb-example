

var avatars = [];

//add Avatar when user enters the app
function createAvatar (id, rec) {	
	var attr = rec.attr;
	var type = rec.type;
	var newBox = document.createElement(type);
	for( var name in attr ) {
		newBox.setAttribute( name, attr[ name ] );
	}
  
  //compute and assign position values to other parts of the avatar
  //wrt the box
	var leye = document.createElement('a-entity')
	leye.setAttribute('mixin','eye')
	var reye = document.createElement('a-entity')
	reye.setAttribute('mixin','eye')
	

	var lpupil = document.createElement('a-entity')
	lpupil.setAttribute('mixin','pupil')
	var rpupil = document.createElement('a-entity')
	rpupil.setAttribute('mixin','pupil')

	var larm = document.createElement('a-entity')
	larm.setAttribute('mixin','arm')
	var rarm = document.createElement('a-entity')
	rarm.setAttribute('mixin','arm')


	var x= attr.position.x;
	var y= attr.position.y;
	var z= attr.position.z;

	var leyex = x+0.25
	var leyey = y+0.20
	var leyez = z-0.6

	var reyex = x-0.25
	var reyey = y+0.20
	var reyez = z-0.6


	var lpx = x+0.25
	var lpy = y+0.20
	var lpz = z-0.8

	var rpx = x-0.25
	var rpy = y+0.20
	var rpz = z-0.8

	leye.setAttribute('position', leyex + " "+ leyey + " " + leyez)
	leye.setAttribute('id','leye'+id)
	reye.setAttribute('position', reyex + " "+ reyey + " " + reyez)
	reye.setAttribute('id','reye'+id)

	lpupil.setAttribute('position', lpx + " "+ lpy + " " + lpz)
	lpupil.setAttribute('id','lpupil'+id)
	rpupil.setAttribute('position', rpx + " "+ rpy + " " + rpz)
	rpupil.setAttribute('id','rpupil'+id)

	var larmx = x-0.5
	var larmy = y
	var larmz = z

	var rarmx = x+0.5
	var rarmy = y
    var rarmz = z
    
	larm.setAttribute('position', larmx + " "+ larmy + " " + larmz)
	larm.setAttribute('id','larm'+id)
	larm.setAttribute('rotation','0 0 -10')
	rarm.setAttribute('position', rarmx + " "+ rarmy + " " + rarmz)
	rarm.setAttribute('id','rarm'+id)
	rarm.setAttribute('rotation','0 0 10')

    //wrap the whole avatar inside a single entity
    var avatarRoot = document.createElement('a-entity');
	avatarRoot.appendChild(newBox);
	avatarRoot.appendChild(leye);
	avatarRoot.appendChild(reye);
	avatarRoot.appendChild(lpupil);
	avatarRoot.appendChild(rpupil);
	avatarRoot.appendChild(larm);
	avatarRoot.appendChild(rarm);
  
    var scene = document.getElementById('scene');
    scene.appendChild(avatarRoot);
  
    avatars[id] = avatarRoot;
} 


function updateAvatar(id, attr) {
    var avatar = avatars[id];
    var position = attr.position;
    var rotation = attr.rotation;
    
    avatar.setAttribute('position', position);
    avatar.setAttribute('rotation', rotation);
  }

var x = 0; //Math.random() * (10 - (-10)) + (-10);
var y = 0; 
var z = 0; 
var initialPosition = {x: x, y: y, z: z};

var myBoxColor = '#aaa'

createAvatar('d',{
    type: 'a-box',
    attr: {
        position: initialPosition,
        rotation: "0 0 0",
        color: myBoxColor,
        id: 'd',
        depth: "1",
        height: "1",
        width: "1"
    }
});

var g = 180;
function drehen()
{
    g+=10;
    if(g > 360) g = 0;
    updateAvatar('d',{ position: "0 1 -5", rotation:"0 "+g+" 0"});
    window.setTimeout(drehen, 200);
}
drehen();



var camera = document.getElementById('camera');
    
   //update camera position 
function update() {
     var latestPosition = camera.getAttribute('position');
	 var latestRotation = camera.getAttribute('rotation');
	 
	
     var attr = {
         position: latestPosition,
         rotation: latestRotation
	   };
	   console.log("position",attr.position);
	   console.log("rotation",attr.rotation);
	setInterval(update, 5000);

	};

	update();