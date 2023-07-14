const handleApiCall = (req, res) => {

	/*const raw = 
			JSON.stringify({
		    "user_app_id": {
		      "user_id": "koky",
		      "app_id": "test"
		    },
		    "inputs": [
		        {
		            "data": {
		                "image": {
		                    "url": req.body.input
		                }
		            }
		        }
		 	]
		});
	

	const requestOptions = {
	    method: 'POST',
	    headers: {
	        'Accept': 'application/json',
	        'Authorization': 'Key 3bb2abf8530f4c439bfd0458cf6e674c'
	    },
	    body: raw
	};		

	fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
	.then(response => response.json())
	.then(data => res.json(data))
	.catch(err => res.status(400).json('unable to work with API'))*/

	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = '3bb2abf8530f4c439bfd0458cf6e674c';
	// Specify the correct user_id/app_id pairings
	// Since you're making inferences outside your app's scope
	const USER_ID = 'koky';
	const APP_ID = 'test';
	// Change these to whatever model and image URL you want to use
	const MODEL_ID = 'face-detection';
	const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
	const IMAGE_URL = req.body.input;

	///////////////////////////////////////////////////////////////////////////////////
	// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
	///////////////////////////////////////////////////////////////////////////////////

	const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

	const stub = ClarifaiStub.grpc();

	// This will be used by every Clarifai endpoint call
	const metadata = new grpc.Metadata();
	metadata.set("authorization", "Key " + PAT);

	stub.PostModelOutputs(
	    {
	        user_app_id: {
	            "user_id": USER_ID,
	            "app_id": APP_ID
	        },
	        model_id: MODEL_ID,
	        version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
	        inputs: [
	            { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
	        ]
	    },
	    metadata,
	    (err, response) => {
	        if (err) {
	            throw new Error(err);
	        }

	        if (response.status.code !== 10000) {
	            throw new Error("Post model outputs failed, status: " + response.status.description);
	        }

	        res.json(response);

	        // Since we have one input, one output will exist here
	        const output = response.outputs[0];

	        console.log("Predicted concepts:");
	        for (const concept of output.data.concepts) {
	            console.log(concept.name + " " + concept.value);
	        }
	    }

	);

}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(erro => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}