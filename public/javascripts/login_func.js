$(document).ready(()=>
{
    $("#Sign_Up_btn").click(()=>
    {
        $(".sign_up_root_input_container").fadeIn('linear');
    });

    $("#close_btn").click(()=>
    {
        // $(".sign_up_root_input_container").hide();
        window.location.href= '/';
    });
});
