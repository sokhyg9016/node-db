$(function()
{
    var COLORS = 
    [
        '#e21400', '#91580f', '#f8a700', '#f78b00', 
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4', 
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    // var socket = io();

    var socket = io();
    
    /*닉네임을 저장할 객체*/
    var username;
    var userpasswd;

    var $window = $(window);

    var $loginPage = $('.login.page');
    var $chatPage = $('.chat.page');

    var $usernameInput = $('.usernameInput');
    var $userpasswdInput = $('.userpasswdInput');
    var $messages = $('.messages');
    var $inputMessage = $('.inputMessage');
    var $currentInput = $usernameInput.focus();

    var $window_frame = $('.window_content');

    /*kakao : 1*/
    /*discord: -1*/ 
    var theme_staus = 1;

    socket.emit('user update', {});

    function clear()
    {
        $('.messages *').hide();
    }

    function show()
    {
        //socket.emit('current user', {});
        alert("function call sucsess!");
    }

    /*유저 닉네임마다 색깔을 지정*/
    function getUsernameColor(username)
    {
        var index = 0;

        for(var i = 0; i < username.length; i++)
        {
            index += username.charCodeAt(i);
        }
        index = Math.abs(index % COLORS.length);
        return COLORS[index];
    }


    function addMessageElement(el)
    {
        $messages.append(el);
    }

    // $code.keypress(function( event )
    // {
    //     if ( event.which == 13 ) {
    //        event.preventDefault();
    //     }
    // });

    $window.keydown(function(event)
    {
        var value = $inputMessage.val();

        if(event.which === 13)
        {
            if(username && value != '')
            {
                socket.emit('chat message', $inputMessage.val());
                $inputMessage.val('');
            }
            /*닉네임 설정*/
            else if(!username || !userpasswd)
            {
                /*유저 네임이 설정되었을 때..*/
                username = $usernameInput.val();
                userpasswd = $userpasswdInput.val();

                if(username && userpasswd)
                {
                    $currentInput = $inputMessage.focus();
                    $loginPage.fadeOut();
                    $chatPage.show();
                    //$window_frame.show();
                    socket.emit('new user', username, userpasswd);
                }
            }
        }
    });

    
    /*전송*/
    $('#submit').click(function()
    {
        if(username && $inputMessage.val() != '')
        {
            socket.emit('chat message',$inputMessage.val());
            $inputMessage.val('');
            return false;
        }
    });
    $('.toggle').click(function()
    {
        theme_staus = theme_staus * (-1);
    });
    
    // function SetUpOther(msg)
    // {
    //     var $other = $('<li class = "message"/>').css({"text-align": "left", "background" : "#fff"}).text(msg);
    //     addMessageElement($other);
    // }

    socket.on('user count', function(data){
        Update_User_Count(data.numOfUsers);
    });    

    socket.on('my message', function(data)
    {   
        var time =  myFunction();

        /*채팅창 명령어*/
        if(data.message === '!정리')
        {
            clear();
        }
        else if(data.message === '!유저')
        {
            show();
        }
        else
        {
            /*chatting log components*/ 
            var $usernameSpan = $('<span class = "username"/>');
            var $messageBodySpan = $('<span class = "messageBody"/>');
            var $timeLog = $('<span id = "time"/>');
            var $user_icon = $('<i class="fas fa-user"/>');
            var $message = $('<li class = "message"/>');
            
            /*kakao theme css*/
            if(theme_staus == 1)
            {
                $messageBodySpan
                .css
                ({
                    "float" : "right",
                    "max-width" : "60%",
                    "color" : "#000",
                    "background" : "#fef01b",
                    "text-align" : "right",
                    "margin": "0px 5px 3px 0px",
                    "padding" : "5px 8px 5px 8px",
                    "border-radius" : "5px", 
                    "margin-bottom" : "3px",
                    "word-wrap" : "break-word",
                    "box-shadow" : "0 3px 4px -4px #556677",
                    "font-size" : "1.2em"
                })
                .text(data.message);

                $timeLog
                .css
                ({ 
                    "float" : "right",
                    "background" : "none",
                    "text-align" : "right",
                    "font-size" : "0.8em",
                    "padding-top" : "10px",
                    "padding-right": "5px"
                })
                .text(time);

                $message.append($messageBodySpan, $timeLog);
            }
            else if(theme_staus == -1)
            {
                $user_icon
                .css
                ({
                    "float":"left",
                    "color": getUsernameColor(data.username),
                    "text-align" : "left",
                    "padding" : "5px 8px 5px 2px",
                    "margin-left" : "17px",
                    "font-weight" : "bold",
                    "font-size" : "1.2em"
                })

                $usernameSpan
                .css
                ({
                    "float":"left",
                    "color": getUsernameColor(data.username),
                    "text-align" : "left",
                    "font-weight" : "bold",
                    "font-size" : "1.2em",
                    "margin-top" : "4px"
                })
                .text(data.username);

                $timeLog
                .css
                ({ 
                    "float" : "left",
                    "background" : "none",
                    "text-align" : "left",
                    "font-size" : "0.8em",
                    "margin-top" : "8px",
                    "margin-left" : "3px",
                    "color" : "#b9bbbe"
                })
                .text("[" + time + "]");

                $messageBodySpan
                .css
                ({
                    "clear" : "both",
                    "float" : "left",
                    "max-width" : "65%",
                    "display" : "block",
                    "color" : "#fff",
                    "background" : "none",
                    "text-align" : "left",
                    "margin": "0px 0px 3px 18px",
                    "padding" : "5px 0px 5px 0px",
                    "border-radius" : "5px", 
                    "word-wrap" : "break-word",
                    "font-size" : "1.2em"
                })
                .text(data.message);

                $message.append($user_icon, $usernameSpan, $timeLog, $messageBodySpan);
            }
            addMessageElement($message);
        }
    });

    socket.on('chat message', function(data)
    {
        
        /*chatting log components*/ 
        var $usernameSpan = $('<span class = "username"/>');
        var $messageBodySpan = $('<span class = "messageBody"/>');
        var $timeLog = $('<span id = "time"/>');
        var $user_icon = $('<i class="fas fa-user"/>');
        var $message = $('<li class = "message"/>');
        var time =  myFunction();

        if(theme_staus == 1)
        {
            $usernameSpan
            .css
            ({
                "display":"block",
                "color": getUsernameColor(data.username),
                "text-align" : "left",
                "padding" : "5px 8px 5px 8px",
                "font-weight" : "bold",
                "margin-left" : "5px"
            })
            .text(data.username);

            $messageBodySpan
            .css
            ({
                "float" : "left",
                "max-width" : "60%",
                "color": "#000", 
                "background" : "#fff",
                "text-align" : "left",
                "padding" : "5px 8px 5px 8px", 
                "border-radius" : "5px", 
                "margin-bottom": "3px",
                "margin-left" : "5px",
                "word-wrap" : "break-word",
                "box-shadow" : "0 3px 4px -4px #556677",
                "font-size" : "1.2em"
            })
            .text(data.message);

            $timeLog
            .css
            ({
                "float" : "left",
                "color": "#556677;",
                "background" : "none",
                "text-align" : "left",
                "font-size" : "0.8em",
                "padding-top" : "10px", 
                "padding-left": "5px"
            })
            .text(time);

            $message.append($usernameSpan, $messageBodySpan, $timeLog);
        }
        else if(theme_staus == -1)
        {
            $usernameSpan
            .css
            ({
                "float":"left",
                "color": getUsernameColor(data.username),
                "text-align" : "left",
                "margin-left" : "17px",
                "font-weight" : "bold",
                "font-size" : "1.2em"
            })
            .text(data.username);

            $timeLog
            .css
            ({ 
                "float" : "left",
                "background" : "none",
                "text-align" : "left",
                "font-size" : "0.8em",
                "margin-top" : "5px",
                "margin-left" : "3px",
                "color" : "#b9bbbe"
            })
            .text("[" + time + "]");

            $messageBodySpan
            .css
            ({
                "clear" : "both",
                "float" : "left",
                "max-width" : "65%",
                "display" : "block",
                "color" : "#fff",
                "background" : "none",
                "text-align" : "left",
                "margin": "0px 0px 3px 18px",
                "padding" : "5px 0px 5px 0px",
                "border-radius" : "5px", 
                "word-wrap" : "break-word",
                "font-size" : "1.2em"
            })
            .text(data.message);

            $message.append($usernameSpan, $timeLog, $messageBodySpan);
        }
        
        addMessageElement($message);
    });

    socket.on('user joined', function(data)
    {
        Update_User_Count(data.numOfUsers);
        var $joinLog = $('<li class = "log">').text(data.username + "님이 채팅방에 참여하였습니다.");
        addMessageElement($joinLog);
    });


    // socket.on('chat message', function(data){
    //     var $usernameSpan = $('<span class = "username"/>')
    //     .css("color", getUsernameColor(data.username)).text(data.username);

    //     var $messageBodySpan = $('<span class = "messageBody"/>').text(msg);

    //     var $message = $('<li class = "message"/>').append($usernameSpan, $messageBodySpan);
    //     addMessageElement($message);
    // });

    // socket.on('user joined', function(data){
    //     var $joinLog = $('<li class = "log"/>').text(data.username + "손님 입장 (" + data.numOfusers + ")");
    //     addMessageElement($joinLog);
    // });

    socket.on('user left', function(data){
        Update_User_Count(data.numOfUsers);
        var $leftLog = $('<li class = "log">').css("color", "#fff").text(data.username + "님이 나갔습니다.");
        addMessageElement($leftLog);
    });

    function Update_User_Count(numOfUsers)
    {
        document.getElementById('count').innerHTML = "&nbsp;&nbsp;" +"30/" + numOfUsers;
    }

    function addZero(i) 
    {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
    }
      
    function myFunction() 
    {
        var d = new Date();
        var nowHour = d.getHours();
        var str;
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
         // var s = addZero(d.getSeconds());

        if ( nowHour <= 12  &&  nowHour  >= 6 ) 
        {
            str = "오전" + h + ":" + m;
        }
        else if (  nowHour >= 12  &&  nowHour  < 22  ) 
        {
            str = "오후" + (h-12) + ":" + m;
        } 
        else if ( nowHour >= 22  &&  nowHour  <= 24  )
        {
            if(nowHour == 24)
             h -= 24;
            
            str = "오후" + h + ":" + m;
        } 
        else 
        {
            str = "오전" + h + ":" + m;
        }
        return str;
    }

});
