from crewai import LLM
import os

nvidia_llm = LLM(
    model="nvidia_nim/meta/llama-4-maverick-17b-128e-instruct",
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
    temperature=0.7,
    max_tokens=1024
)
