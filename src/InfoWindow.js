import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server'

export class InfoWindow extends React.Component {
    componentDidMount() {
        /*console.log("InfoWindow.componentDidMount(visible=" + this.props.visible 
            + ":mapCenter=" + this.props.mapCenter 
            + ":google=" + this.props.google + ")"); */
        this.renderInfoWindow();
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("InfoWindow.componentDidUpdate()");
        if (!this.props.google || !this.props.map) {
          return;
        }

        if (this.props.map !== prevProps.map) {
            this.renderInfoWindow();
        }

        if (this.props.children !== prevProps.children) {
            this.updateContent();
        }
        
        if ((this.props.visible !== prevProps.visible) || (this.props.marker !== prevProps.marker)) {
            this.props.visible ? this.openWindow() : this.closeWindow();
        }
    }

    updateContent() {
        //console.log("InfoWindow.updateContent()")
        const content = this.renderChildren();
        this.infowindow.setContent(content);
    }

    renderChildren() {
        //console.log("InfoWindow.renderChildren()")
        const {children} = this.props;
        return ReactDOMServer.renderToString(children);
    }

    renderInfoWindow() {
        //console.log("InfoWindow.renderInfoWindow()")
        let {map, google, mapCenter} = this.props;

        if (google) {
            const iw = this.infowindow = new google.maps.InfoWindow({content: ''});

            google.maps.event.addListener(iw, 'closeclick', this.onClose.bind(this))
            google.maps.event.addListener(iw, 'domready', this.onOpen.bind(this));   
        }
    }
  
    onOpen() {
      if (this.props.onOpen) this.props.onOpen();
    }
  
    onClose() {
      if (this.props.onClose) this.props.onClose();
    }

    openWindow() {
        //console.log("InfoWindow.openWindow()")
        this.infowindow.open(this.props.map, this.props.marker);
    }

    closeWindow() {
        //console.log("InfoWindow.closeWindow()")
        this.infowindow.close();
    }

    render() {
        return null;
    }
}