jat.Target.prototype.bindArrowEvents = function (touch) {
    
    var self = this,
        i,
        mouseDown = false,
        oldPageX,
        oldPageY,
        arrowTempElement,
        arrowTemp,
        arrowTempID,
        arrowSetTemp,
        arrowSetTempID,
        arrowRingTemp,
        tempID,
        x,
        y,
        dragHeight = 0;
            
    
    this.container.on('mousemove', function (e) {
                    
        if (mouseDown && arrowSetTemp.draggable) {
                        
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
                        
                        
            arrowTempElement.setPosition({
                x: x,
                y: y
            });
                
            
            if (arrowSetTemp.draggable instanceof Object) {
                
                self.setArrowDrag({
                    x: x,
                    y: y,
                    drag: arrowSetTemp.draggable,
                    arrowRadius: arrowSetTemp.radius
                });
                
            }
            
            
            arrowRingTemp = self.calculateRing({
                x: x,
                y: y - dragHeight,
                target: arrowTemp[3]
            });
                      
                        
            arrowTemp[0] = self.convertTo.pc.x(x, arrowTemp[3]);
            arrowTemp[1] = self.convertTo.pc.y(y - dragHeight, arrowTemp[3]);
            arrowTemp[2] = arrowRingTemp;
                        

            if (self.checkOnTarget(arrowTemp, {x: x, y: y})) {
                                                    
                tempID = self.checkClosestTarget(arrowTemp[3], {x: x, y: y});
                            
                if (arrowTemp[3] !== tempID) {
                                
                    arrowTemp[3] = tempID;
                                
                    self.setTargetStyle("arrow", { active: arrowTemp[3] });
                    
                }
            }
                        
            oldPageX = e.pageX;
            oldPageY = e.pageY;
            
            
            /* Save temp data into arrow array */
            self.arrow[arrowSetTempID] = arrowSetTemp;
            self.arrow[arrowSetTempID].data[arrowTempID] = arrowTemp;
            
                        
            $(arrowTempElement).trigger('arrowMove.jArcherTarget', [arrowSetTempID, arrowTempID, self.arrow]);
                                        
        }
                    
        return false;
                    
                    
    }).on('mousedown mouseover', '.arrowSetCanvas circle', function (e) {
                    
        if (!mouseDown) {
              
            arrowTempElement = this;
                    
            arrowSetTempID = arrowTempElement.parentNode.id.substr(arrowTempElement.parentNode.id.indexOf('_') + 1);
            arrowSetTemp = self.arrow[arrowSetTempID];
                        
            arrowTempID = $(this).attr('class');
            arrowTemp = arrowSetTemp.data[arrowTempID];
                        
        }
                    
        if (e.type === 'mousedown') {
                    
            
            var x = e.pageX,
                y = e.pageY;
        
            
            mouseDown = self.arrowDrag = true;
                            
            
            self.setTargetStyle("arrow", { active: arrowTemp[3] });
                    
            $(self.container).css({ cursor: 'move' });
                        
            arrowTempElement.setAttribute('fill', arrowSetTemp.style.selected.color);

            $(arrowTempElement).css({
                opacity: arrowSetTemp.style.selected.opacity
            }).trigger('arrowSelect.jArcherTarget', [arrowSetTempID, arrowTempID]);
    
            
            
            if (arrowSetTemp.draggable instanceof Object) {
                
                self.createArrowDrag({
                    x: x,
                    y: y,
                    drag: arrowSetTemp.draggable,
                    color: arrowSetTemp.style.selected.color,
                    arrowRadius: arrowSetTemp.radius
                });
                
                dragHeight = arrowSetTemp.draggable.height + arrowSetTemp.radius;
                
                
            } else {
                
                dragHeight = 0;
                
            }
            
                    
            oldPageX = e.pageX;
            oldPageY = e.pageY;
                    
                               
        } else if (e.type === 'mouseover') {
                    
            if (!mouseDown) {
                
                arrowTempElement.setAttribute('fill', arrowSetTemp.style.hover.color);
                        
                $(arrowTempElement).css({
                    opacity: arrowSetTemp.style.hover.opacity
                }).trigger('arrowOver.jArcherTarget', [arrowSetTempID, arrowTempID]);
                
            }
                                        
        }
                    
        return false;
                    
                    
    }).on('mouseup mouseout', '.arrowSetCanvas circle', function (e) {
                    
                    
        if (e.type === 'mouseup') {
                        
                        
            self.setTargetStyle("initial");
                    
                        
            arrowTempElement.setAttribute('fill', arrowSetTemp.style.hover.color);
                    
            
            if (arrowSetTemp.draggable instanceof Object) {
                
                self.removeArrowDrag();
                
                arrowTempElement.setPosition({
                    x: x,
                    y: y - dragHeight
                });
                
            }
            

            $(self.container).css({
                cursor: 'default'
            }).trigger('arrowClick.jArcherTarget', [arrowSetTempID, arrowTempID]).trigger('arrowDeselect.jArcherTarget', [arrowSetTempID, arrowTempID]);
                        
                        
            mouseDown = self.arrowDrag = false;
    
                            
        } else if (e.type === 'mouseout') {
                        
            if (!mouseDown || !arrowSetTemp.draggable) {
                        
                arrowTempElement.setAttribute('fill', arrowSetTemp.style.initial.color);
                            

                $(arrowTempElement).css({
                    opacity: arrowSetTemp.style.initial.opacity
                }).trigger('arrowOut.jArcherTarget', [arrowSetTempID, arrowTempID]);
                        

                mouseDown = self.arrowDrag = false;
            }
                            
        }
                    
        return false;
                    
                    
    });
            
};