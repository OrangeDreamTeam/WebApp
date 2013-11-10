/**
 * @jsx React.DOM
 */
var socket = io.connect('http://localhost');

var Header = React.createClass({
  render: function() {
    var login_indicator;
    if (this.props.user) {
      login_indicator = <div class="login-indicator">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="46px" height="55px" viewBox="0 0 46 55" enable-background="new 0 0 46 55">
<g>
	<circle fill="#028C90" cx="24.213" cy="14.207" r="13.714"/>
	<path fill="#028C90" d="M46,55v-6.543C46,40.896,42.652,35,37.252,35H11.174C5.773,35,0,40.896,0,48.457V55H46z"/>
</g>
</svg>
        <span class="user-name">{this.props.user.name}</span>
      </div>;
    } else {
      login_indicator = <div class="login-indicator">
        <button onClick={this.props.promptLogin}>Login</button>
      </div>;
    }
    var logo_style= {
      height: "100px",
      width: "165px",
      backgroundImage: "url(/dashlogo.png)"
    };
    return <div class='header'>
      <div class='logo' style={logo_style}></div>
      <div class='stats'>
        <h3><strong>{this.props.served}</strong> Seniors Served</h3>
        <h3><strong>{this.props.downloads}</strong> App Downloads</h3>
      </div>
      {login_indicator}
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
      debugger;
      var oMyForm = new FormData();
      oMyForm.append('csv', fileString);
      var oReq = new XMLHttpRequest();
      oReq.open("POST", "/importCSV");
      oReq.send(oMyForm);
    };
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
    return <div style={div_style} class='upload-btn'>
      UPLOAD THE DAMN CSV
      <input style={style} type="file" onChange={this.uploadUsingStupidJQuery} />
    </div>;
  }
});

var ContactList = React.createClass({
  render: function(){
    var phones = this.props.phones, phoneBoxes = [];
    for (var i = 0; i < phones.length; i++) {
      phoneBoxes.push(<div class="phone-box" onClick={this.props.onSelect} data-phone={JSON.stringify(phones[i])}>
        <h4>{phones[i].name}</h4>
        <p>{phones[i].pnum}</p>
        </div>);
    }
    return <div class='contact-list'><h3>ContactList</h3>{phoneBoxes}</div>;
  }
});

var RoutesList = React.createClass({
  render: function(){
    var routes = this.props.routes, routeBoxes = [];
    for (var i = 0; i < routes.length; i++) {
      routeBoxes.push(<div class="route-box" onClick={this.props.onSelect} data-route={JSON.stringify(routes[i])}>
        <h4>{routes[i].name}</h4>
        <h5>{routes[i].stops + " stops"}</h5>
        <p>{"last fulfilled on " + routes[i].last}</p>
        </div>);
    }
    return <div class='routes-list'><h3>Routes</h3>{routeBoxes}</div>;
  }
});

var AlertsList = React.createClass({
  render: function() {
    var alerts = [], alert;
    for (var i = 0; i < this.props.alerts.length; i++) {
      alert = this.props.alerts[i];
      alerts.push(<div class="alert-box">
          <div class="alert-time">{alert.time.toLocaleTimeString()}</div>
          <div class="message">
            <div class="message-body">
              {alert.message}
            </div>
            <div class="message-recipient">
              <span class="name">{alert.name}</span>
              <span class="phone">{alert.phone}</span>
            </div>
          </div>
        </div>);
    }
    console.log("alerts",alerts);
    return <div class="alerts-list">
      <h3>Recent Alerts</h3>
      <button>View All</button>
      <div class="alerts">
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
      routeBoxes.push(<div class="route-tracking-box">
          <h4 class='caretaker-name'>{routes[i].caretaker}</h4>
          <h5 class='route-progress'>{'Stops Visited: '+routes[i].progress+'/'+routes[i].route.stops}</h5>
          <div class='route-actions'>
            <button data-type={'schedule'} data-route={routejson} onClick={this.props.onAction}>Schedule</button>
            <button data-type={'track'} data-route={routejson} onClick={this.props.onAction}>Map</button>
            <button data-type={'call'} data-route={routejson} onClick={this.props.onAction}>Call</button>
            <button data-type={'alert'} data-route={routejson} onClick={this.props.onAction}>Alert</button>
          </div>
        </div>);
    }
    return <div class='routes-tracker'>
        <h3>Active Today</h3>
        {routeBoxes}
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
    var alerts = [
      {name: "Jamie Crabb",
       phone: "912-337-1703",
       time: new Date(2013, 11, 9, 6, 0),
       message: "Yuval Dekel will not be home today, you need to reschedule for another day."
      }
    ];
    return {activeRoutes: activeRoutes, selectedPhone: null, selectedRoute: null, phones:[], routes:[], alerts: alerts, twilio: false};
  },
  componentWillMount: function() {
    var setState = this.setState;
    var component = this;
    //setup socket.io notifications and stuff
    socket.on('alert', function (data) {
    console.log(data);
    });
    socket.on('track', function (info) {
    console.log(data);
    });
    socket.on('phones', function (phonesData) {
    setState.call(component,{phones: phonesData.phones});
    console.log(phonesData);
    });
    socket.on('routes', function (routesData) {
    setState.call(component,{routes: routesData.routes});
    console.log(routesData)
    });
    socket.emit('phones');
    socket.emit('routes');
    socket.on('twi-token', function(twiData) {
      console.log('twi-token');
      Twilio.Device.setup(twiData.token);
      Twilio.Device.ready(function() {
        Twilio.Device.connect({
          agent: "Smith",
          phone_number: twiData.num
        });
        setState.call(component, {twilio: true});
        //TODO: VERY PRONE TO BUGS, MAKE BETTER. DEKEL.
        setTimeout(function() {
          setState.call(component, {twilio: false});
        }, 600000);
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
      socket.emit('track', {phonenumber: route.phone.pnum});
    } else if (e.target.dataset.type === "alert") {
      socket.emit('alert', {phonenumber: route.phone.pnum});
    } else if (e.target.dataset.type === "call") {
      console.log('call');
      socket.emit('twi-token', {num: route.phone.pnum});
    }
  },
  showRouteinfo: function(e) {
    console.log("sri", e.target.dataset);
  },
  render: function() {
    return <div class='dashboard'>
      <Header served={"100,000"} downloads={"42"} user={{name:"Staff Member", image_src: "http://www.codinghorror.com/.a/6a0120a85dcdae970b017742d249d5970d-800wi"}} />
      <JQUERYISDUMB />
      <RouteTracker onAction={this.handleRouteAction} onMoreInfo={this.showRouteinfo} activeRoutes={this.state.activeRoutes} twilio={this.state.twilio}/>
      <RoutesList onSelect={this.selectRoute} routes={this.state.routes} />
      <AlertsList alerts={this.state.alerts} />
      <ContactList ponSelect={this.selectPhone} phones={this.state.phones} />
    </div>;
  }
});
 
React.renderComponent(<Dashboard />, document.getElementById('content'));
