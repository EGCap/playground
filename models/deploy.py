import baseten
import truss
import os

BASETEN_API_KEY = os.getenv('BASETEN_API_KEY')

baseten.login(BASETEN_API_KEY)

instructor_embedding = truss.load('./instructor_embedding')

baseten.deploy(
    instructor_embedding,
    model_name='Instructor Embedding',
    # publish=True, # Uncomment to skip the draft stage
)
