/**
 * @jsx React.DOM
 */
var socket = io.connect('http://' + location.hostname);

var Header = React.createClass({
  link: function() {
    window.location = '/';
  },
  render: function() {
    var login_indicator;
    if (this.props.user) {
      login_indicator = <div className="login-indicator">
<svg className="user-image" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="46px" height="55px" viewBox="0 0 46 55" enable-background="new 0 0 46 55">
<g>
	<circle fill="#028C90" cx="24.213" cy="14.207" r="13.714"/>
	<path fill="#028C90" d="M46,55v-6.543C46,40.896,42.652,35,37.252,35H11.174C5.773,35,0,40.896,0,48.457V55H46z"/>
</g>
</svg>
        <div className="user-name">{this.props.user.name}</div>
      </div>;
    } 
    var logo_style= {
      height: "100px",
      width: "165px",
      backgroundImage: "url(/dashlogo.png)"
    };
    return <div className={['header']}><div className={['headerContainer']}>
      <div className='logo' style={logo_style} onClick={this.link}></div>
      {login_indicator}
      <div className='stats'>
        <div className='statNumbers'>
          <div>{this.props.served}</div>
          <div>{this.props.downloads}</div>
        </div>
        <div className='statText'>
          <div>Seniors Served</div>
          <div>App Downloads</div>
        </div>
      </div>
      </div>
    </div>;
  }
});

var JQUERYISDUMB = React.createClass({
  uploadUsingStupidJQuery: function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function(evt) {
      var fileString = evt.target.result;
      var oMyForm = new FormData();
      oMyForm.append('csv', fileString);
      var oReq = new XMLHttpRequest();
      oReq.open("POST", "/importCSV");
      oReq.send(oMyForm);
    };
  },
  triggerOnClick: function(e){
    this.refs.fileIn.getDOMNode().click();
  },
  render: function() {
    var style = {
      cursor: "pointer",
      display: "block",
      width: "250px",
      opacity: "0",
      top: "0",
      bottom: "0",
      position: "absolute",
      overflow: "hidden"}
    var div_style = {
      cursor: "pointer",
      position: "relative",
      width: "250px",
      height: "30px",
      color: "White",
      backgroundColor: "#007fff"
    };
    return <div className="fileDiv">
    <input className="hiddenFile" ref="fileIn" type='file' onChange={this.uploadUsingStupidJQuery}/>
     <div className='upload-btn' onClick={this.triggerOnClick}>IMPORT SCHEDULES</div></div>;
  },
  componentWillMount: function() {
    
  }
});

var ContactList = React.createClass({
  render: function(){
    var phones = this.props.phones, phoneBoxes = [];
    for (var i = 0; i < phones.length; i++) {
      phoneBoxes.push(<div className="phone-box" onClick={this.props.onSelect} data-phone={JSON.stringify(phones[i])}>
        <div className="phoneName">{phones[i].phoneName}</div>
        <div className="contactPhone">{phones[i].phoneNumber}</div>
        </div>);
    }
    return <div className='contact-list'><div className="contactTitle">Contact List</div>{phoneBoxes}</div>;
  }
});

var RoutesList = React.createClass({
  render: function(){
    var routes = this.props.routes, routeBoxes = [];
    for (var i = 0; i < routes.length; i++) {
      routeBoxes.push(<div className="route-box" onClick={this.props.onSelect} data-route={JSON.stringify(routes[i])}>
        <div className='caretaker-name'>{routes[i].name}</div>
        <div className='route-progress'>{routes[i].stops + " stops"}</div>
        <div>{"last fulfilled on " + routes[i].last}</div>
        </div>);
    }
    return <div className='routes-list'><h3>Routes</h3>{routeBoxes}</div>;
  }
});

var AlertsList = React.createClass({
  render: function() {
    console.log('120',this.props.alerts);
    var alerts = [], alert;
    for (var i = this.props.alerts.length -1; i >= 0; i--) {
      alert = this.props.alerts[i];
      alerts.push(<div className="alert-box">
          <div className="alert-time">{new Date(parseInt(alert.time, 10)).toLocaleTimeString()}</div>
          <div className="message">
            <div className="message-body">
              {alert.message}
            </div>
            <div className="message-recipient">
              <span className="name">{alert.sender}</span>
              <span className="phone">{alert.phoneNumber}</span>
            </div>
          </div>
        </div>);
    }
    console.log("alerts",alerts);
    return <div className="alerts-list">
      <div className="alertsTitle">Recent Alerts</div>
      <button className='viewAllButton'>View All</button>
      <div className="alerts">
        {alerts}
      </div>
    </div>;
  }
});

var RouteTracker = React.createClass({
  render: function() {
    var routes = this.props.activeRoutes, routeBoxes = [], routejson;
    for (var i = 0; i < routes.length; i++) {
      routejson = JSON.stringify(routes[i]);
      routeBoxes.push(<div className="route-tracking-box">
          <div className='caretaker-name'>{routes[i].routeName + " - " + routes[i].phoneName}</div>
          <div className='route-progress'>{'Stops Visited: '+1+'/'+3}</div>
          <div className='route-actions'>
            <button data-type={'schedule'} data-route={routejson} onClick={this.props.onAction}>Schedule</button>
            <button data-type={'track'} data-route={routejson} onClick={this.props.onAction}>Map</button>
            <button data-type={'call'} data-route={routejson} onClick={this.props.onAction}>Call</button>
            <button data-type={'alert'} data-route={routejson} onClick={this.props.onAction}>Alert</button>
          </div>
        </div>);
    }
    return <div className='routes-tracker'>
        <div className="top-bar">
          <div className='activeTitle'>Active Today</div>
          <button className="view-schedule-btn">View Schedules</button>
          <button className="alert-all-btn">Alert All</button>
        </div>
        <div className="main-chart">
          {routeBoxes}
        </div>
      </div>;
  }
});

var Dashboard = React.createClass({
  getInitialState: function() {
    var activeRoutes = [
      {phone: {pnum: 4049066696,
        name: "dekelphone"},
      caretaker: "Dekel",
      route: {name: "Route B (George, Hammersmith, Gary)",
        last: new Date(2013, 11, 5),
        stops: 3},
      progress: 1}
    ];
    return {served: 100000, activeRoutes: activeRoutes, selectedPhone: null, selectedRoute: null, phones:[], routes:[], alerts: [], twilio: false};
  },
  componentWillMount: function() {
    var setState = this.setState;
    var component = this;
    //setup socket.io notifications and stuff
    socket.on('alert', function (data) {
      console.log(data);
    });
    socket.on('track', function (info) {
      var url = "http://maps.google.com/?q="+info.lat+","+info.long;
      window.open(url, "about:new");
    });
    socket.on('phones', function (phonesData) {
      setState.call(component,{phones: phonesData.phones});
    console.log(phonesData);
    });
    socket.on('alerts', function (phonesData) {
      setState.call(component,{alerts: phonesData.alerts});
    });
    socket.on('routes', function (routesData) {
      setState.call(component,{routes: routesData.routes});
    console.log(routesData)
    });
    socket.emit('phones');
    socket.emit('routes');
    socket.emit('alerts');
    socket.on('twi-token', function(twiData) {
      Twilio.Device.setup(twiData.token);
      Twilio.Device.ready(function(device) {
        Twilio.Device.connect({
          CallerId: '+1 678-389-7815',
          PhoneNumber: twiData.num
        });
        //setState.call(component, {twilio: true});
      });
    });
  },
  selectPhone: function(e) {
    console.log("sp", e.target.dataset);
  },
  selectRoute: function(e) {
    console.log("sr", e.target.dataset);
  }, 
  handleRouteAction: function(e) { 
    console.log("hra", e.target.dataset); 
    var route = JSON.parse(e.target.dataset.route);
    if (e.target.dataset.type === "track") {
      socket.emit('track', {phonenumber: route.phoneNumber});
    } else if (e.target.dataset.type === "alert") {
      var msg = prompt("alert message:");
      socket.emit('alert', {phonenumber: route.phoneNumber, phoneid: route.phoneId, message: msg});
    } else if (e.target.dataset.type === "call") {
      console.log('call');
      socket.emit('twi-token', {num: route.phoneNumber});
    }
  },
  showRouteinfo: function(e) {
    console.log("sri", e.target.dataset);
  },
  render: function() {
    return <div className='dashboard'>
      <Header served={this.state.served} downloads={"42"} user={{name:"Staff Member", image_src: "http://www.codinghorror.com/.a/6a0120a85dcdae970b017742d249d5970d-800wi"}} />
      <div className='body'>
        <div className='left-column'>
          <JQUERYISDUMB />
          <div className='viewReportsButton'>VIEW REPORTS</div>
          <RouteTracker onAction={this.handleRouteAction} onMoreInfo={this.showRouteinfo} activeRoutes={this.state.routes} twilio={this.state.twilio}/>

        </div>
        <div className='right-column'>
          <AlertsList alerts={this.state.alerts} />
          <ContactList ponSelect={this.selectPhone} phones={this.state.phones} />
        </div>
      </div>
    </div>;
  }
});
 
React.renderComponent(<Dashboard />, document.getElementById('content'));
