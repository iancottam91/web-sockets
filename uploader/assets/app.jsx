import React from 'react';
import ReactDOM from 'react-dom';
import Input from '@bbc/igm-input';

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
        return (<div>
            <p>Enter your image description below!</p>
            <div>
                <Input type="text" onChange={this.handleChange} value={this.state.description} />
                <button onClick={this.submitData} className="igm-btn">Submit</button>
            </div>
        </div>);
    }
}

ReactDOM.render(
    <Greetings name="Chris" />,
    document.getElementById('root')
);