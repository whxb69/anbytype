define([
    "base/js/namespace",
    "jquery",
    "bootstrap",
    'base/js/events',
], function (IPython, $, bs, events) {
    "use strict";

    var type_refresh = function(){
    	addcss();

    	IPython.notebook.get_cells().forEach(function(cell){
    		addctrl(cell);   	
    })  
        console.log(events);
        events.on('create.Cell',callback_create_cell);             //code内容不可编译起作用 rel:l95
        events.on('rendered.MarkdownCell',addnctrl);
}	
    
    /*为新添加的cell或转换添加ctrl*/
    var addnctrl = function(){
        IPython.notebook.get_cells().forEach(function(cell){
            var ifctrl = cell.element.find('.type_btn').length;
            if(ifctrl == 0){
                addctrl(cell);
            }
        })
    }

    var callback_create_cell = function(evt,data){
        console.log(data.cell);
        if (data.cell.cell_type == 'code') {
            if (data.cell.element.find('type_ctrl').length == 0) {}
                addctrl(data.cell);
        }
    }

    var addnctrl_code = function(){
        var cell = IPython.notebook.get_cells()[-1];
    }
    var addctrl = function(cell) {
        var type = cell.cell_type;
            switch(type){
                case 'markdown':
                    var icon = 'fa-align-justify';
                    break;
                case 'code':
                    var icon = 'fa-code';
                    break;
            }

            var crtl = $('<button/>').addClass('btn btn-default type_btn dropdown-toggle fa ' + icon)
                       .attr('id',"tlabel")
                       .attr('data-toggle',"dropdown")
                       .attr('aria-haspopup',"true")
                       .attr('aria-expanded',"false")
                       .appendTo(cell.element.find('.input_prompt'))
                       .click(function(){
                            var cells = IPython.notebook.get_cells();
                            var btns = $('.type_btn')
                            var i = 0;
                            while(this != btns[i]){
                                i++;
                            }
                            IPython.notebook.select(i);
                       });
            var content = $('<div/>').addClass('type_menu')
            var ul = $('<ul/>')
                    .addClass("dropdown-menu")
                    .attr('role',"menu")
                    .attr('aria-labelledby',"tlabel")
                    .css('list-style-type ','none')
                    .css('padding','inherit')
            var li1 = $('<li/>')
            var a1 = $('<i/>').addClass('type-chg btn fa fa-code').click(function(){type_change(cell,'fa-code');});
            li1.append(a1)
            var li2 = $('<li/>')
            var a2 = $('<i/>').addClass('type-chg btn fa fa-align-justify').click(function(){type_change(cell,'fa-align-justify');});
            li2.append(a2)
            ul.append(li1);
            ul.append(li2);
            if(cell.element.find('.type_menu').length == 0){
            	content.appendTo(cell.element.find('.input_prompt'));
            	ul.appendTo(cell.element.find('.input_prompt'));
            }
            $('.dropdown-toggle').dropdown();
            $('pover-content').css('padding','inherit');
    }
	
    var type_change = function(cell,icon){
		switch(icon){
			case 'fa-align-justify':
                var index = IPython.notebook.get_selected_index();
                IPython.notebook.to_markdown(index);
                break;
			case 'fa-code':    			
                var index = IPython.notebook.get_selected_index();
                IPython.notebook.to_code(index);
				break;
		}
        IPython.notebook.execute_cell();
        
        var cur = IPython.notebook.get_cell(index);
        var c_type = cur.cell_type;
        console.log(c_type);
        switch(c_type){                            //转code时内容可编译走这条  rel:l16
			case 'code':
                setTimeout(function(){
                    addctrl(cur);
                    },0)
                
                IPython.notebook.execute_cell();
                break;
		}
	}

    var type_ctrl = function(){
    	var labels = $('.cell_type')
    	var temp = [];
    	for(var i = 0;i < labels.length;i++){
    		temp[i] = labels[i]
    	}

    	if(temp.length > 0 && $(temp[0]).hasClass('hidden')){
    		temp.forEach(function(label){
    			$(label).removeClass('hidden')
    		})
    	}else{
    		temp.forEach(function(label){
    			$(label).addClass('hidden')
    		})
    	}
    }

    var addcss = function(){
    	var styleElement = document.getElementById('styles_js');

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }

        var newStyle = 'div.popover-content{padding:inherit}'

        styleElement.appendChild(document.createTextNode(newStyle));
    }

    var load_ipython_extension = function () {
  		events.on('notebook_loaded.Notebook', type_refresh);
        if (IPython.notebook._fully_loaded) type_refresh();

        IPython.toolbar.add_buttons_group([
            IPython.keyboard_manager.actions.register ({
                help   : 'type of cell',
                icon   : 'fa-certificate',
                handler : type_ctrl
            }, 'type of cell', 'anbytype')
        ]);
    };

  var extension = {
        load_ipython_extension : load_ipython_extension,
    };
    return extension;
});