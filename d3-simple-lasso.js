(function(){

    var d3lasso =function(backgroundSelection, overlaySelection, elementsSelection, xAccessor, yAccessor, callback)
    {
        var that = this;
        this.lassoEl = null;
        this.lassoLine = d3.svg.line()
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1]; })
            .interpolate("basis");
        this.inLasso = false;

        this.xAccessor = xAccessor || function(d){return d.x};
        this.yAccessor = yAccessor || function(d){return d.y};
        this.callback = callback || function(sel){ sel.classed("selected",true); }

        this.lassoPoints = [];

        backgroundSelection.on({
            "mousedown": function () {
                that.lassoPoints = [d3.mouse(this)];
                that.inLasso=true;
                if (!lassoEl){
                    that.lassoEl = overlaySelection.append("path").attr({
                        class:"d3lasso_poly"
                    }).style({
                        "pointer-events":"none"
                    })
                }


            },
            "mousemove":function(){
                if (inLasso){
                    that.lassoPoints.push(d3.mouse(this));
                    that.lassoEl.data([that.lassoPoints]);
                    that.lassoEl.attr("d", that.lassoLine);
                }

                elementsSelection.classed("d3lasso_selected", function(d){
                    if (inPolygon(that.lassoPoints, that.xAccessor(d), that.yAccessor(d))) return true;
                    else return null;
                })
            },

            "mouseup": function () {
                console.log("up");
                if (that.inLasso){
                    that.lassoPoints = [];
                    that.lassoEl.remove();
                    that.lassoEl = null;

                    var sel = d3.selectAll(".d3lasso_selected")
                        sel.classed("d3lasso_selected",null)
                    that.callback(sel)
                }

                inLasso=false;
            }


        })



        /*
         * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
         * */
        var inPolygon = function (polygon, x, y) {

            var c = false;
            for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                var x_i = polygon[i][0], y_i = polygon[i][1];
                var x_j = polygon[j][0], y_j = polygon[j][1];

                if (((y_i > y) != (y_j > y)) && (x < (x_j - x_i) * (y - y_i) / (y_j - y_i) + x_i))
                {
                    c = !c;
                }
            }
            return c;
        };

    };

    if (typeof define === "function" && define.amd) define(d3lasso); else if (typeof module === "object" && module.exports) module.exports = d3lasso;
    this.d3lasso = d3lasso;
})();