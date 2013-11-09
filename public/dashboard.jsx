/**
 * @jsx React.DOM
 */
var socket = io.connect('http://localhost');

var PhonesList = React.createClass({
    render: function(){
        var phones = this.props.phones, phoneBoxes = [];
        for (var i = 0; i < phones.length; i++) {
            phoneBoxes.push(<div class="phone-box" onClick={this.props.onSelect} data-phone={JSON.stringify(phones[i])}>
                <h4>{phones[i].name}</h4>
                <p>{phones[i].pnum}</p>
              </div>);
        }
        return <div class='phones-list'><h3>Phones</h3>{phoneBoxes}</div>;
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

var RouteTracker = React.createClass({
    render: function(){
        var routes = [
            {phone: {pnum: 4049066696,
                name: "dekelphone"},
            caretaker: "Dekel",
            route: {name: "Route B (George, Hammersmith, Gary)",
                last: new Date(2013, 11, 5),
                stops: 3},
            progress: 1}
        ], routeBoxes = [], routejson;
        for (var i = 0; i < routes.length; i++) {
            routejson = JSON.stringify(routes[i]);
            routeBoxes.push(<div class="route-tracking-box">
                    <h4 class='route-name'>{routes[i].route.name}</h4>
                    <h4 class='caretaker-name'>{routes[i].caretaker}</h4>
                    <div class='route-actions'>
                        <button data-type={'track'} data-route={routejson} onClick={this.props.onAction}>Track</button>
                        <button data-type={'call'} data-route={routejson} onClick={this.props.onAction}>Call</button>
                        <button data-type={'alert'} data-route={routejson} onClick={this.props.onAction}>Alert</button>
                    </div>
                </div>);
        }
        return <div class='routes-tracker'>
                <h3>Current Routes</h3>
                {routeBoxes}
            </div>;
    }
});

var Dashboard = React.createClass({
    getInitialState: function() {
        return {selectedPhone: null, selectedRoute: null, phones:[], routes:[]};
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
      }
    },
    showRouteinfo: function(e) {
        console.log("sri", e.target.dataset);
    },
    render: function() {
        return <div class='dashboard'>
            <PhonesList ponSelect={this.selectPhone} phones={this.state.phones} />
            <RoutesList onSelect={this.selectRoute} routes={this.state.routes} />
            <RouteTracker onAction={this.handleRouteAction} onMoreInfo={this.showRouteinfo} />
        </div>;
    }
});
 
React.renderComponent(<Dashboard />, document.getElementById('content'));
