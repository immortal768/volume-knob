d = document,
$dial = d.getElementById('dial'),
$knob = d.getElementById('knob'),
$debug = d.getElementById('debug'),
$active = d.getElementById('active'),
$track = d.getElementById('slider-track'),
$activeTrack = d.getElementById('slider-active'),
$pin = d.getElementById('slider-pin'),
big = 0,
threshold = 0.05,
rotation = 0, //avoid negative arc rotation
ns = 'http://www.w3.org/2000/svg';

mask = d.createElementNS(ns, 'svg');
mask.setAttribute('width','185');
mask.setAttribute('height','185');

path = d.createElementNS(ns, 'path');
path.setAttribute('stroke','#f266d0');
path.setAttribute('fill-opacity','0');
path.setAttribute('stroke-width','5');
path.setAttribute('fill', '#FFF');
mask.setAttribute('id','cp');

mask.appendChild(path);
$dial.appendChild(mask);
path.appendChild($active);

updateArc = function(dAngle, fromDial){

    rAngle = dAngle*(Math.PI / 180);
    
    x = 88 - 88 * Math.cos(rAngle) ;
    y = - 88 * Math.sin(rAngle);
    var big = (rAngle > Math.PI)? 1:0;
    var d = 'M0,88 a88,88 0 ' + big + ',1 ' + x + ',' + y;
    path.setAttribute('d', d);
    
    $knob.style.webkitTransform = 'rotate('+(dAngle)+'deg)'; 
    if(fromDial){updateSlider(dAngle);}
    
};

updateSlider = function(ang){
    x  = ((ang/360)*270);
    $pin.style.webkitTransform = 'translate3d('+x+'px,0,0)';
    $activeTrack.style.webkitTransform = 'translate3d('+x+'px,0,0)';    
};

refPoint = {},
sPoint = {},
quad = 0,
centerX = 245,
centerY = 295,
_piOver180 = Math.PI / 180,
_180OverPi = 180 / Math.PI;

updateArc(rotation);

//Mouse Events
$pin.addEventListener('mousemove', function(ev){
    x = ev.pageX - 115;
    if(x>0 && x<270){
        $pin.style.webkitTransform = 'translate3d('+x+'px,0,0)';
        $activeTrack.style.webkitTransform = 'translate3d('+x+'px,0,0)';
        pX = ((x/270) * 360);
        updateArc(pX);
    }
    
});

$dial.addEventListener('mousedown',function(){
    sPoint = {q: 'active'};
});

$dial.addEventListener('mousemove', function(ev){

    if(sPoint.q){
        dX = -(ev.pageX - centerX);
        dY = -(ev.pageY - centerY);
         
        ang = Math.atan2(dY,dX);
        if(ang<0){ang = ang + 2*Math.PI;}
        
        if( Math.abs(refPoint.angle - ang) < 5 || !refPoint.angle){
            refPoint = {x: ev.pageX, y: ev.pageY, angle: ang};
            //console.log(dX+", "+dY+" | r: "+refPoint.angle+" | d: "+refPoint.angle * (180/Math.PI));
            updateArc(refPoint.angle * (180/Math.PI), true);
        }
    }
});

$dial.addEventListener('mouseup', function(){
    sPoint = {};
});


//Touch Events
$pin.addEventListener('touchmove', function(ev){
    x = ev.touches[0].pageX - 115;
    if(x>0 && x<270){
        $pin.style.webkitTransform = 'translate3d('+x+'px,0,0)';
        $activeTrack.style.webkitTransform = 'translate3d('+x+'px,0,0)';
        pX = ((x/270) * 360);
        updateArc(pX);
    }
});

$dial.addEventListener('touchstart', function(ev){
    sPoint = {q: 'active'};
});

$dial.addEventListener('touchmove', function(ev){
    
    if(sPoint.q){
        dX = -(ev.touches[0].pageX - centerX);
        dY = -(ev.touches[0].pageY - centerY);
         
        ang = Math.atan2(dY,dX);
        if(ang<0){ang = ang + 2*Math.PI;}
        
        if( Math.abs(refPoint.angle - ang) < 5 || !refPoint.angle){
            refPoint = {x: ev.pageX, y: ev.pageY, angle: ang};
            //console.log(dX+", "+dY+" | r: "+refPoint.angle+" | d: "+refPoint.angle * (180/Math.PI));
            updateArc(refPoint.angle * (180/Math.PI), true);
        }
    }        
});
$dial.addEventListener('touchend', function(ev){
    refPoint = {};
});

//Gesture Events
$dial.addEventListener('gesturechange', function(g){
    rotation = (rotation + g.rotation % 360);
    $knob.style.webkitTransform = 'rotate('+(rotation)+'deg)'; 
    updateArc(rotation*_piOver180, true);
});

$dial.addEventListener('gestureend', function(g){
    rotation = rotation;
});        
