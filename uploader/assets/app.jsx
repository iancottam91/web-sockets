import React from 'react';
import ReactDOM from 'react-dom';
import Input from '@bbc/igm-input';
import request from 'superagent';

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
        // send data
        console.log({ text: this.state.description, complete: true });
        request
            .post('/api/upload')
            .send({ text: this.state.description, complete: true })
            .set('Accept', 'application/json')
            .then(function(res) {
                console.log(res.body);
            });
    }

    handleChange(value) {
        this.setState({description: value});
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