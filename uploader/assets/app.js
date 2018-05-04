class Greetings extends React.Component{

    constructor() {
        super();
        this.state = {
            description: "abc"
        }
        this.submitData = this.submitData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    submitData(e) {
        e.preventDefault();
        console.log('submitData');
        $.post("/api/upload", { text: this.state.description, complete: true }, function (data) {
            console.log(data);
        });
    }

    handleChange(e) {
        this.setState({description: e.target.value});
    }

    render()
    {
        return React.createElement('div', null,
            React.createElement('p', null, 'Enter your image description below!'),
            React.createElement('div', null,
                React.createElement('input', {
                    type: "text",
                    onChange: this.handleChange,
                    value: this.state.description
                }),
            ),
            React.createElement('a', {
                onClick: this.submitData,
                href: "#0"
            }, 'Submit'),
        )
    }
}

ReactDOM.render(
    React.createElement(Greetings, { name : 'Chris' }),
    document.getElementById('root')
);