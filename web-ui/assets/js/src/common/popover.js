/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module( 'mypopover', [] )

.directive( 'mypopover', function ($http, $templateCache, $compile) {




return {
	restrict: 'EA',
    replace: true,
    transclude: true,
    //scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', templatePath: '@' },
    link: function (scope, element, attrs) {
        var popOverContent;
        var templatePath_ = 'src/common/popoverTemplate.html';
        var template = '';
        var options = {
                content: popOverContent,
                placement: "right",
                html: true,
                date: scope.date
            };
        
        if(attrs.templatepath !== undefined) {
        	templatePath_ = attrs.templatepath;
        }
        
        template = $templateCache.get(templatePath_);
        
        if(template === undefined) {
        	$http({method: 'GET', url: templatePath_, cache: true}).then(function(response){
        		popOverContent = response.data;             
                popOverContent = $compile("<div>" + popOverContent+"</div>")(scope);
                options.content = popOverContent;
                $(element).popover(options);
        	});        	
        }
        else
        {
        	popOverContent = template;             
        	popOverContent = $compile("<div>" + popOverContent+"</div>")(scope);
        	options.content = popOverContent;
        	$(element).popover(options);
        }        
    }
};
});