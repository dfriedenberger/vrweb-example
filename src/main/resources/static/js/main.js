

var avatars = [];
var avatars_heartbeat = [];

var last_attr = "";

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

//remove Avatar when user quits the app
function removeAvatar(id){
	var scene = document.getElementById('scene');
	scene.removeChild(avatars[id]);
 }


/*
var g = 180;
function drehen()
{
    g+=10;
    if(g > 360) g = 0;
    updateAvatar('d',{ position: "0 1 -5", rotation:"0 "+g+" 0"});
    window.setTimeout(drehen, 200);
}
drehen();
*/

const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
    publishKey: "pub-c-f3ce8ddf-3531-4ef1-a8f7-31afc142660d",
    subscribeKey: "sub-c-7d2e88ac-4359-11ea-833a-9e82b35d3d47",
	uuid: uuid
});

pubnub.subscribe({
    channels: ['vr_position_channel'],
    withPresence: true
});


pubnub.addListener({
    message: function(event) {

	  console.log(JSON.stringify(event));
	  
	  var id = event.message.sender;
	  var attr = event.message.content;
	  var now = Date.now();

	  if(id != uuid)
	  {
		 
		//Set Position of Avatar / Create if not exits
		console.log("set position");
		avatars_heartbeat[id] = now;

		if(!(id in avatars))
		{
			console.log("Create Avatar "+id)
			var myBoxColor = '#aaa'
			createAvatar(id,{
				type: 'a-box',
				attr: {
					position: {x: 0, y: 0, z: 0},
					rotation: "0 0 0",
					color: myBoxColor,
					id: id,
					depth: "1",
					height: "1",
					width: "1"
				}
			});
		}

		updateAvatar(id,{ position: attr.position, rotation: attr.rotation });
	}
	  //delete
	  avatars_heartbeat
	  for (var aid in avatars_heartbeat){
		if (avatars_heartbeat.hasOwnProperty(aid)) {
			
             var timeout = now - avatars_heartbeat[aid];
			console.log(aid+" => "+timeout,now,avatars_heartbeat[aid]);

			if(timeout > 3000)
			{
				removeAvatar(aid);
				delete avatars_heartbeat[aid];
			}
		}
	  }

    },
    presence: function(event) {
	
	  console.log(JSON.stringify(event));
	  if(event.action =="join")
	  {
		console.log(event.uuid + " has joined.");
		last_attr = "";
	  }
	  if(event.action == "timeout")
	  {
		console.log(event.uuid + " leave.");
	  }
    }
  });

//update 
var camera = document.getElementById('head');
var container = document.getElementById('cameraRig');

//update camera position 
function updateCameraPosition() {
     var latestPosition = camera.getAttribute('position');
	 var latestRotation = camera.getAttribute('rotation');
	 
	 var containerPosition = container.getAttribute('position');
	 var containerRotation = container.getAttribute('rotation');


	 var position = Object.assign({}, latestPosition);

	 position.x += containerPosition.x;
	 position.y += containerPosition.y;
	 position.z += containerPosition.z;


    var attr = {
         position: position,
		 rotation: latestRotation,
		 containerPosition: containerPosition,
		 containerRotation: containerRotation
	};

	if(JSON.stringify(attr) != last_attr)
	{
	   last_attr = JSON.stringify(attr);
	   console.log("Changed position "+ JSON.stringify(attr) );
	}

	pubnub.publish({
		channel : "vr_position_channel",
		message : {"sender": uuid, "content": attr}
	}, function(status, response) {
	//Handle error here
	});
	
	
	setTimeout(updateCameraPosition, 500);

};

updateCameraPosition();


var parrot = document.getElementById('parrot');
var position= parrot.getAttribute('position');
//update camera position 
function updatePosition() {

position.x+= 0.1;
setTimeout(updatePosition, 100);
}
updatePosition();