jsPlumb.ready(function () {

    // setup some defaults for jsPlumb.
    instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 5}], //radius 设置为1找不到点
        Connector:"Straight",
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            /*[ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "连接到", id: "label", cssClass: "aLabel" }]*/
        ],
        Container: "canvas"
    });

    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });


    var canvas = document.getElementById("canvas");
    var windows = jsPlumb.getSelector(".statemachine-demo .w");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening. 
    //连接线事件
    instance.bind("mouseover", function (c) {
        //c.setPaintStyle({strokeStyle:"rgb(0,255,255)"});
        $(c.getOverlay("myLabel").getElement()).find("span").show();
        //instance.detach(c); //去掉连接线
    }),instance.bind("mouseout",function(c){
        $(c.getOverlay("myLabel").getElement()).find("span").hide();
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        var connectors = instance.getConnections({source:info.sourceId,target:info.targetId});
        if(connectors.length >1 || info.sourceId == info.targetId){
            jsPlumb.detach(connectors[connectors.length-1]);
        }
        //info.connection.getOverlay("label").setLabel("状态：未知");
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    /*jsPlumb.on(canvas, "dblclick", function(e) {
        newNode(e.offsetX, e.offsetY);
    });*/

    //
    // initialise element as connection targets and source.
    //
    var initNode = function(el) {

        // initialise draggable elements.
        instance.draggable(el);

        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            //maxConnections: 4,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });

        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    };

    var newNode = function(x, y, content,id) {
        var d = document.createElement("div");
        var id = id || jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
        d.innerHTML = content + "<span class='glyphicon glyphicon-remove'></span><div class=\"ep\"></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        return d;
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        var nodes = [
            {id:"s1",target:["s2"],content:"<img src='img/icons/1.png'/>",position:{left:70+10,top:10}},
            {id:"s2",target:["s3","s4"],content:"<img src='img/icons/2.png'/>",position:{left:70+300,top:10}},
            {id:"s3",target:[],content:"<img src='img/icons/3.png'/>",position:{left:70+600,top:10}},
            
            {id:"s4",target:["s6","s7","s8","s5"],content:"<img src='img/icons/4.png'/>",position:{left:70+300,top:150}},
            {id:"s5",target:[],content:"<img src='img/icons/5.png'/>",position:{left:70+600,top:150}},
            
            {id:"s6",target:["s9","s10"],content:"<img src='img/icons/6.png'/>",position:{left:70+10,top:300}},
            {id:"s7",target:["s11","s12"],content:"<img src='img/icons/6.png'/>",position:{left:70+300,top:300}},
            {id:"s8",target:["s13","s14"],content:"<img src='img/icons/6.png'/>",position:{left:70+600,top:300}},

            {id:"s9",target:[],content:"<img src='img/icons/7.png'/>",position:{left:70+-60,top:440}},
            {id:"s10",target:[],content:"<img src='img/icons/8.png'/>",position:{left:70+78,top:440}},

            {id:"s11",target:[],content:"<img src='img/icons/9.png'/>",position:{left:70+220,top:440}},
            {id:"s12",target:[],content:"<img src='img/icons/8.png'/>",position:{left:70+370,top:440}},

            {id:"s13",target:[],content:"<img src='img/icons/10.png'/>",position:{left:70+530,top:440}},
            {id:"s14",target:[],content:"<img src='img/icons/11.png'/>",position:{left:70+670,top:440}},
        ];
        var connectors = [];
        for(var i = 0;i < nodes.length;i++){
            var item = nodes[i];
            item.content = $(item.content).attr("title","设备名称：XXXXXXXX\n设备IP：XXXXXXXX\n设备类型：Weblogic\n所属安全域：XXXX\n设备状态:连通  Cpu:10%  内存：60%\n磁盘利用率:c盘75% d盘30% e盘34%").get(0).outerHTML;
            if(item.id == "s6"){
                item.content += "<div class='alarms'><div class='btn-group'><a href='javascript:;' class='dropdown-toggle' data-toggle='dropdown' ><img src='img/2.png'/></a>"+
                "<ul class='dropdown-menu'><li><a href='#'>监控告警：0</a></li><li><a href='#'>事件告警：1</a></li></ul></div>"+
                "<div class='btn-group'> <a href='javascript:;'class='dropdown-toggle' data-toggle='dropdown'><img src='img/3.png'/></a>"+
                                "<ul class='dropdown-menu'><li><a href='#'>高危漏洞：0</a></li><li><a href='#'>低危漏洞：1</a></li></ul></div></div>";
            }
            newNode(item.position.left,item.position.top,item.content,item.id);
            if(item.target && item.target.length){
                connectors.push({source:item.id,target:item.target});
            }
        }
        var allCon = [];
        for(var j = 0;j<connectors.length;j++){
            var item = connectors[j];
            for(var k = 0;k<item.target.length;k++){
                var t = item.target[k];
                var aId = "myL"+item.source+t;
                var con = instance.connect({
                    source:item.source,
                    target:t,
                    type:"basic",
                    overlays:[ 
                        [ "Label", { label:"<div class='m-icon' title='源设备：XXXX、源端口：XXX\n目的设备：XXXX、目的端口：XXX\n流入流量：\n流出流量：\n总流量：'><span class='glyphicon glyphicon-exclamation-sign'></span></div>", location:0.5, id:"myLabel" }]
                    ],
                    parameters:item
                });
                allCon.push(con);
            }
        }
        //连接线中Label移动
        /*var interval = setInterval(function(){
            for(var i=0;i<allCon.length;i++){
                var aId = "myLabel",con = allCon[i];
                try{
                    var l = con && con.getOverlay(aId);
                    if(l){
                        con.removeOverlay(aId);
                        var loc = l.loc >= 1 ? 0.01 : (l.loc+0.01);
                        
                        con.addOverlay([ "Label", { label:"<div class='m-icon'></div>", location:loc, id:aId } ]);

                    }else{
                        clearInterval(interval);
                    }
                }catch(e){console.log(e);}
            }
        },70);*/
        
        $("#canvas").on("mouseover", '.w', function(){
            $(this).find("span.glyphicon-remove").show();
        }).on("mouseout",'.w',function(){
            $(this).find("span.glyphicon-remove").hide();
        }).on("click"," span.glyphicon-remove",function(){
            var id = $(this).parent().prop("id");
            instance.detachAllConnections(id);
            jsPlumb.remove(id);
            $(allCon).each(function(i,item){
                if(item.source == id || item.target == id){
                   // allCon.
                }
            });
        }).on("mouseover",'.m-icon',function(){
            $(this).find("span").show();
        }).on("mouseout",'.m-icon',function(){
            $(this).find("span").hide();
        });
    });
return;



    //jsPlumb.fire("jsPlumbDemoLoaded", instance);
    var newnode = newNode(70,200,"新节点");

    var def = {
        source:newnode.id,
        target: 's1',
        type:"basic",
        parameters: {a:'111',b:'333'},
        paintStyle:{
            strokeStyle:"red",
            lineWidth:3
        },
        //endpoint:[ "Rectangle", { width:30, height:10 } ],
        overlays:[ 
            /*["Custom", {
              create:function(component) {
                return $("<select id='myDropDown' style='width:70px;'><option value='foo'>foo</option><option value='bar'>bar</option></select>");                
              },
              location:0.5,
              id:"customOverlay"
            }],*/
            "Diamond"//,
            //[ "Arrow", { width:10, length:30, location:0.1, id:"arrow" } ]
            //[ "Label", { label:"<div class='m-icon'></div>", location:0.5, id:"myLabel" } ]
        ] };
    var con = instance.connect(def);
    //con.getOverlay("label").setLabel("新连接。。。");
    
    
    console.log(con.getOverlay("myLabel"));

});
