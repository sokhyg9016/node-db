$(function()
{
    var $messages = $('.messages');
    var $inputMessage = $('.inputMessage');

    var theme_staus = 1;

    var $window = $(window);

    $window.keydown(function(event)
    {
        var value = $inputMessage.val();

        if(event.which === 13)
        {
            if(value != '')
            {
                socket.emit('chat message', $inputMessage.val());
                $inputMessage.val('');
            }
        }
    });

    $('#submit').click(function()
    {
        if( $inputMessage.val() != '')
        {
            socket.emit('chat message',$inputMessage.val());
            $inputMessage.val('');
            return false;
        }
    });


    function addMessageElement(el)
    {
        $messages.append(el);
    }

    socket.on('my message', function(data)
    {   

        /*chatting log components*/ 
        var $messageBodySpan = $('<span class = "messageBody"/>');
        // var $timeLog = $('<span id = "time"/>');
        // var $user_icon = $('<i class="fas fa-user"/>');
        var $message = $('<li class = "message"/>');
            
        $message.append($messageBodySpan, $message);
        addMessageElement($message);
    });
    

    socket.on('chat message', function(data)
    {
        /*chatting log components*/ 
        var $messageBodySpan = $('<span class = "messageBody"/>');
        // var $timeLog = $('<span id = "time"/>');
        // var $user_icon = $('<i class="fas fa-user"/>');
        var $message = $('<li class = "message"/>');
            
        $message.append($messageBodySpan, $message);
        addMessageElement($message);
    });

    socket.emit('test', {});
});