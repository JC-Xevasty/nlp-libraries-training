from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import libraries
import torch
from transformers import BartTokenizer, BartForConditionalGeneration
from transformers import pipeline

app = FastAPI()


class TextSchema(BaseModel):
    input: str


origins = ["http://localhost:5173", "localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/summarize")
async def summarize(request: TextSchema):
    input = request.input

    # Return error code if no input
    if not input:
        raise HTTPException(status_code=422, detail="input is required")

    input = input

    print(type(input))

    # Load the pre-trained BERT model and tokenizer for summarization
    model_name = "facebook/bart-large-cnn"
    tokenizer = BartTokenizer.from_pretrained(model_name)
    model = BartForConditionalGeneration.from_pretrained(model_name)

    # Tokenize and generate the summary
    inputs = tokenizer(input, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(
        inputs["input_ids"],
        max_length=150,
        min_length=30,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True,
    )

    # Decode and print the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return {"summary": summary}
