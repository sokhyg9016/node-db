document.getElementById('htmleditor').style.fontSize='17px';
// document.getElementById('csseditor').style.fontSize='14px';
// document.getElementById('jseditor').style.fontSize='14px';

function update()
{
    var res = document.getElementById('result').contentWindow.document;
    res.open();
    res.write(eh.getValue()); //to get value Inserted in a div
    // For css
    // res.write('<style>' + ec.getValue() + '</style>'); //to get value Inserted in a div
    // res.write('<script>' + ej.getValue() + '<' + '/script>'); //to get value Inserted in a div
    res.close();
}

function seteditor()
{
    window.eh = ace.edit("htmleditor");
    // eh.setTheme("ace/theme/tomorrow_night");
    eh.setTheme("ace/theme/twilight");
    eh.getSession().setMode("ace/mode/html");
    eh.setAutoScrollEditorIntoView(true);

    // window.ec = ace.edit("csseditor");
    // ec.setTheme("ace/theme/tomorrow_night");
    // ec.getSession().setMode("ace/mode/css");
    // ec.setAutoScrollEditorIntoView(true);

    // window.ej = ace.edit("jseditor");
    // ej.setTheme("ace/theme/tomorrow_night");
    // ej.getSession().setMode("ace/mode/javascript");
    // ej.setAutoScrollEditorIntoView(true);


    //Now on change we update ifrmaes to show result
    eh.getSession().on('change', function()
    {
        update(); //Create update function
    });       
    // ec.getSession().on('change', function()
    // {
    //     update(); //Create update function
    // });
    // ej.getSession().on('change', function()
    // {
    //     update(); //Create update function
    // });

}
seteditor();
update();

$(document).ready(function()
{
    var html, css, js;

    html = $("#html_box");
    css = $("#css_box");
    js = $("#js_box");

    $('#html_colunm').click(function()
    {
        html.toggle();
    });
    $('#css_colunm').click(function()
    {
        css.toggle();
    });
    $('#js_column').click(function()
    {
        js.toggle();
    });

    $('#output_column').click(function()
    {
        $("#result").toggle();
    });
});