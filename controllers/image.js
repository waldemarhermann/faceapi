//Other possible versions of code to run clarifai

/*#1
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key dccf89db237d4a289a1e30ac87e105a4");

const handleApiCall = (req, res) => {
    const { input } = req.body;
    const model = 'd02b4508df58432fbb84e800597b8959';

    stub.PostModelOutputs(
        {
            model_id: model,
            inputs: [{ data: { image: { url: input } } }],
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log(err);
                return res.status(400).json('unable to work with API');
            }
            const outputs = response.outputs;
            if (outputs && outputs.length > 0) {
                const faceBoxes = outputs[0].data.regions.map(region => region.region_info.bounding_box);
                return res.json(faceBoxes);
            } else {
                return res.status(400).json('unable to work with API');
            }
        }
    );
} */


/* #2
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key dccf89db237d4a289a1e30ac87e105a4");

const handleApiCall = (req, res) => {
stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "a403429f2ddf4b49b307e318f00e528b",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
  );
} */

const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'dccf89db237d4a289a1e30ac87e105a4' 
});
  
const handleApiCall = (req, res) => {
    app.models
        .predict(
            {
                id: 'face-detection',
                name: 'face-detection',
                version: '6dc7e46bc9124c5c8824be4822abe105',
                type: 'visual-detector',
            }, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to connect to API'))
    }


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('error'));
}

module.exports = {
    handleImage,
    handleApiCall
}