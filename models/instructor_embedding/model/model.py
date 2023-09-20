"""
The `Model` class is an interface between the ML model that you're packaging and the model
server that you're running it on.

The main methods to implement here are:
* `load`: runs exactly once when the model server is spun up or patched and loads the
   model onto the model server. Include any logic for initializing your model, such
   as downloading model weights and loading the model into memory.
* `predict`: runs every time the model server is called. Include any logic for model
  inference and return the model output.

See https://truss.baseten.co/quickstart for more.
"""
from InstructorEmbedding import INSTRUCTOR


class Model:
    def __init__(self, **kwargs):
        # Uncomment the following to get access
        # to various parts of the Truss config.

        # self._data_dir = kwargs["data_dir"]
        # self._config = kwargs["config"]
        # self._secrets = kwargs["secrets"]
        self._model = None

    def load(self):
        # Load model here and assign to self._model.
        self._model = INSTRUCTOR("hkunlp/instructor-large")
        self._instruction = "Represent the document for retrieval: "

    def predict(self, model_input):
        # Run model inference here
        text_instruction_pairs = [[self._instruction, text_input] for text_input in model_input]
        embeddings = self._model.encode(text_instruction_pairs)
        return embeddings.tolist()
