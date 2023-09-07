from datasets import load_dataset

dataset = load_dataset("wikipedia", "20220301.simple")


# import tokenizer
import tiktoken

# write dataset to JSONL file
transformedData = []

joinedData = dataset["train"]
for i in range(len(joinedData)):
    text = joinedData[i]["text"]
    title = joinedData[i]["title"]
    url = joinedData[i]["url"]


    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode("Title:"+title+" Text:"+text)
    # only embed the first 8000 tokens
    tokens = tokens[:8000] if len(tokens) > 8000 else tokens
    toEmbed = enc.decode(tokens)

    value = "Title:"+title+" URL:"+url+" Text:"+text
    transformedData.append({
        "toEmbed": toEmbed,
        "value": {
            "title": title,
            "url": url,
            "text": text
        }
    })

# Write to JSONL file
import jsonlines

with jsonlines.open('data.jsonl', mode='w') as writer:
    writer.write_all(transformedData)
