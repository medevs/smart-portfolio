---
title: "The Complete Guide to OpenAI API: A Practical Developer's Handbook"
date: "2025-04-03"
author: "Ahmed Oublihi"
tags: ["AI", "OpenAI", "API", "Web Development", "AI Agents", "AI Tools"]
category: "Artificial Intelligence"
description: "Explore a complete guide to the OpenAI API, covering everything from setup and core functionality to advanced features, performance optimization, error handling, and practical use cases. Perfect for developers looking to integrate and leverage OpenAI models effectively."
---

In the rapidly evolving landscape of artificial intelligence, few technologies have made as significant an impact as OpenAI's suite of powerful language models. At the forefront of this revolution is the OpenAI API, a versatile interface that grants developers access to some of the most sophisticated AI models ever created. Whether you're building a conversational assistant, automating content generation, or implementing advanced natural language processing capabilities, the OpenAI API offers unprecedented opportunities to integrate cutting-edge AI into your applications.

The journey of OpenAI's API offerings has been nothing short of remarkable. What began with GPT-3 has evolved into a comprehensive ecosystem of models and services, each designed to address specific use cases and requirements. From the versatile GPT-4o to specialized tools for embeddings, moderation, and fine-tuning, the OpenAI API has expanded to meet the growing demands of developers and businesses worldwide.

This comprehensive guide is crafted for developers, data scientists, product managers, and businesses looking to harness the full potential of OpenAI's technology. Whether you're taking your first steps into the world of AI or seeking to optimize your existing implementations, this resource aims to provide you with the knowledge, best practices, and practical examples needed to succeed.

## Who This Guide Is For

This guide is designed to serve a diverse audience with varying levels of expertise:

- **Developers** seeking to integrate AI capabilities into their applications
- **Data scientists** looking to leverage language models for analysis and insights
- **Product managers** exploring AI features for their product roadmaps
- **Businesses** evaluating the potential of AI to transform their operations
- **AI enthusiasts** wanting to deepen their understanding of large language models

No matter where you fall on this spectrum, you'll find valuable insights tailored to your needs and experience level.

## What You'll Learn

By the end of this comprehensive guide, you will have gained:

- A thorough understanding of the OpenAI API architecture and capabilities
- Practical knowledge of how to authenticate, make requests, and process responses
- Insights into choosing the right models for specific use cases
- Hands-on experience with code examples covering various API features
- Strategies for optimizing performance and managing costs
- Best practices for error handling, security, and responsible AI implementation
- Awareness of ethical considerations and limitations of AI models

## The Evolution of OpenAI's API

The OpenAI API has undergone significant evolution since its initial release. What started as access to a single model has expanded into a comprehensive platform offering multiple specialized services:

- **2020**: Initial release of the GPT-3 API with text completion capabilities
- **2021**: Introduction of Codex models for code generation and understanding
- **2022**: Launch of DALL-E for image generation and GPT-3.5 series models
- **2023**: Release of GPT-4, function calling capabilities, and the Assistants API
- **2024**: Introduction of GPT-4o, multimodal capabilities, and the Responses API

Each iteration has brought improvements in capabilities, performance, and usability, making the API more powerful and accessible to developers worldwide.

## Why OpenAI API Matters

The significance of the OpenAI API extends beyond its technical capabilities. It represents a democratization of advanced AI technology, allowing organizations of all sizes to implement solutions that were previously only available to those with extensive resources and expertise. This accessibility has sparked innovation across industries, from healthcare and education to customer service and content creation.

For developers, the API offers a way to focus on building valuable applications without needing to train and maintain complex AI models. For businesses, it provides a competitive edge through enhanced automation, personalization, and data analysis capabilities. And for society at large, it presents both opportunities and challenges as we navigate the implications of increasingly capable AI systems.

## The Current Landscape

As of 2025, the OpenAI API stands at the intersection of several important trends in AI development:

1. **Multimodal capabilities** that combine text, image, and potentially other forms of data
2. **Specialized models** optimized for specific tasks and domains
3. **Enhanced reasoning abilities** that approach human-like problem-solving in certain contexts
4. **Improved fine-tuning** options for customizing models to specific use cases
5. **Greater focus on responsible AI** development and deployment

Understanding these trends is crucial for developers looking to make the most of the API's capabilities while navigating its limitations and ethical considerations.

## Getting the Most from This Guide

To maximize the value of this guide, we recommend:

- Following along with the code examples in your own development environment
- Experimenting with different parameters and inputs to understand their effects
- Referring to the official OpenAI documentation for the most up-to-date information
- Joining community forums to share experiences and learn from other developers
- Approaching AI implementation with both creativity and responsibility

The field of AI is evolving rapidly, and staying informed about the latest developments will help you make the most of these powerful tools.

In the following sections, we'll dive deeper into the technical aspects of the OpenAI API, starting with a comprehensive overview of its architecture and components. Whether you're building your first AI-powered application or optimizing an existing one, this guide will provide you with the knowledge and tools you need to succeed.

Let's begin our journey into the world of OpenAI's API.
# Understanding the OpenAI API

## What is the OpenAI API?

The OpenAI API provides developers with access to OpenAI's state-of-the-art artificial intelligence models through a simple and consistent interface. At its core, the API serves as a bridge between your applications and OpenAI's powerful language models, allowing you to integrate advanced AI capabilities without needing to train or maintain complex models yourself.

Unlike traditional APIs that might perform specific, limited functions, the OpenAI API offers a versatile set of capabilities that can be applied to virtually any task involving language understanding, generation, or reasoning. This flexibility makes it suitable for a wide range of applications, from conversational agents and content creation to data analysis and code generation.

## Key Features and Capabilities

The OpenAI API offers a comprehensive set of features designed to meet diverse development needs:

### Natural Language Processing
- Text generation with human-like quality
- Summarization of long documents
- Question answering based on provided context
- Language translation across numerous languages
- Sentiment analysis and emotion detection
- Entity recognition and extraction

### Reasoning and Problem-Solving
- Step-by-step problem decomposition
- Logical reasoning through complex scenarios
- Mathematical calculations and equation solving
- Decision-making based on provided criteria
- Structured data extraction from unstructured text

### Creative Content Generation
- Writing in various styles and formats
- Story and narrative creation
- Marketing copy and product descriptions
- Email drafting and communication assistance
- Poetry, scripts, and creative writing

### Code and Technical Capabilities
- Code generation in multiple programming languages
- Code explanation and documentation
- Debugging assistance
- Converting natural language to code
- API documentation generation

### Multimodal Understanding
- Processing and analyzing images alongside text
- Describing visual content
- Answering questions about images
- Generating text based on visual inputs

## API Architecture and Components

The OpenAI API is structured around several key components that work together to provide a comprehensive development platform:

### Core APIs

1. **Chat Completions API**: The traditional interface for interacting with OpenAI's models, structured around conversation-style interactions with role-based messages.

2. **Responses API**: A newer, streamlined interface that simplifies interactions with the models and provides enhanced capabilities for certain use cases.

3. **Embeddings API**: Generates vector representations of text that capture semantic meaning, useful for search, clustering, and recommendations.

4. **Moderation API**: Helps identify potentially harmful or inappropriate content to ensure responsible AI use.

### Specialized Services

1. **Assistants API**: A higher-level interface for building AI assistants with persistent memory and specialized tools.

2. **Fine-tuning API**: Allows customization of models for specific use cases by training on your own data.

3. **Files API**: Manages file uploads for use with various API features.

4. **Batch API**: Enables processing large volumes of requests efficiently.

### Supporting Infrastructure

1. **Authentication System**: Secures API access through API keys and organization IDs.

2. **Rate Limiting**: Manages request volumes to ensure fair usage and system stability.

3. **Monitoring and Logging**: Provides visibility into API usage and performance.

4. **Versioning System**: Ensures compatibility as the API evolves.

## Responses API vs. Chat Completions API

OpenAI offers two primary interfaces for generating text with their models: the newer Responses API and the traditional Chat Completions API. Understanding the differences between these interfaces is crucial for choosing the right approach for your application.

### Responses API

The Responses API represents OpenAI's latest approach to model interaction, designed to simplify the developer experience while offering enhanced capabilities:

**Key Features:**
- Streamlined interface with fewer required parameters
- Built-in support for multimodal inputs (text and images)
- Simplified handling of conversation context
- More consistent output formatting
- Enhanced support for structured outputs

**Example Usage:**
```python
response = client.responses.create(
    model="gpt-4o",
    instructions="You are a helpful assistant that provides concise explanations.",
    input="What is the difference between supervised and unsupervised learning?"
)
print(response.output_text)
```

### Chat Completions API

The Chat Completions API is the traditional interface that has been available since the introduction of ChatGPT models:

**Key Features:**
- Fine-grained control through numerous parameters
- Explicit conversation management through message arrays
- Support for function calling
- Detailed token usage information
- Compatibility with a wider range of models

**Example Usage:**
```python
completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that provides concise explanations."},
        {"role": "user", "content": "What is the difference between supervised and unsupervised learning?"}
    ]
)
print(completion.choices[0].message.content)
```

### When to Use Each API

- **Choose the Responses API when:**
  - You need a simpler interface with fewer parameters
  - You're working with multimodal inputs (text + images)
  - You want more consistent output formatting
  - You're building new applications from scratch

- **Choose the Chat Completions API when:**
  - You need maximum control over model parameters
  - You're implementing complex function calling
  - You require detailed token usage statistics
  - You're maintaining existing applications built on this API

Both APIs access the same underlying models and capabilities, so your choice should be based on your specific development needs and preferences rather than model performance considerations.

In the following sections, we'll explore how to get started with the OpenAI API, including account setup, authentication, and making your first API calls.
# Getting Started with OpenAI API

## Creating an OpenAI Account

Before you can start using the OpenAI API, you'll need to create an account and obtain API credentials. The process is straightforward:

1. **Visit the OpenAI Platform**: Navigate to [platform.openai.com](https://platform.openai.com) and click on the "Sign Up" button.

2. **Create Your Account**: You can sign up using an email address and password, or through single sign-on options like Google or Microsoft accounts.

3. **Verify Your Email**: Check your inbox for a verification email from OpenAI and follow the instructions to verify your account.

4. **Complete Your Profile**: Provide the required information about yourself and your intended use case for the API.

5. **Set Up Billing**: To access the full capabilities of the API, you'll need to add a payment method. OpenAI offers a free tier with limited usage, but for production applications, you'll want to set up proper billing.

Once your account is created and verified, you'll have access to the OpenAI platform dashboard, where you can manage your API keys, monitor usage, and access documentation.

## Obtaining and Managing API Keys

API keys are the primary method for authenticating your requests to the OpenAI API. Here's how to obtain and manage them:

1. **Generate an API Key**:
   - Log in to your OpenAI account
   - Navigate to the "API Keys" section in your account settings
   - Click "Create new secret key"
   - Give your key a descriptive name (e.g., "Development Environment")
   - Copy and securely store the key immediately, as you won't be able to view it again

2. **API Key Best Practices**:
   - Treat your API keys like passwords
   - Never hardcode keys directly in your application code
   - Don't share keys in public repositories or client-side code
   - Use different keys for development and production environments
   - Regularly rotate keys, especially if you suspect they may have been compromised

3. **Revoking Keys**:
   - If a key is compromised or no longer needed, immediately revoke it from the API Keys dashboard
   - Create a new key to replace any revoked keys

Remember that your API key provides access to your OpenAI account and billing, so it's crucial to keep it secure.

## Setting Up Your Development Environment

To start working with the OpenAI API, you'll need to set up your development environment. Here's a step-by-step guide for Python, the most commonly used language for OpenAI API integration:

### Installing the OpenAI Python Library

The official OpenAI Python library provides a convenient interface for making API calls. Install it using pip:

```bash
pip install openai
```

For production environments, it's recommended to pin the version to avoid unexpected changes:

```bash
pip install openai==1.70.0  # Replace with the latest version
```

### Environment Configuration

Best practice is to store your API key in environment variables rather than in your code:

1. **Create a `.env` file** in your project root (make sure to add it to `.gitignore`):

```
OPENAI_API_KEY=your-api-key-here
```

2. **Load environment variables** in your application:

```python
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access the API key
api_key = os.environ.get("OPENAI_API_KEY")
```

You'll need to install the `python-dotenv` package:

```bash
pip install python-dotenv
```

### Initializing the OpenAI Client

With your environment set up, you can now initialize the OpenAI client:

```python
from openai import OpenAI

client = OpenAI(
    # This is the default and can be omitted if OPENAI_API_KEY is set in your environment
    api_key=os.environ.get("OPENAI_API_KEY"),
)
```

For applications that need to make asynchronous requests, use the async client:

```python
import asyncio
from openai import AsyncOpenAI

async_client = AsyncOpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

async def main():
    # Use the async client here
    response = await async_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)

# Run the async function
asyncio.run(main())
```

## Authentication Best Practices

Securing your OpenAI API integration is crucial for both security and cost management. Here are some best practices for authentication:

### Environment-Based Configuration

Always use environment variables or secure secret management systems to store API keys:

- In development: Use `.env` files with tools like `python-dotenv`
- In production: Use your platform's secret management (AWS Secrets Manager, Google Secret Manager, Azure Key Vault, etc.)

### API Key Rotation

Implement a regular schedule for rotating API keys:

```python
# Example function to check if key rotation is needed
def should_rotate_api_key(last_rotation_date, rotation_period_days=90):
    from datetime import datetime, timedelta
    
    rotation_threshold = last_rotation_date + timedelta(days=rotation_period_days)
    return datetime.now() > rotation_threshold
```

### Request Signing

For enterprise applications, consider implementing request signing for additional security:

```python
import hmac
import hashlib
import time

def sign_request(payload, secret_key):
    timestamp = int(time.time())
    message = f"{timestamp}.{payload}"
    signature = hmac.new(
        secret_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return {
        "payload": payload,
        "timestamp": timestamp,
        "signature": signature
    }
```

### Proxy Services

For applications where the client needs to make API calls, consider using a proxy service to avoid exposing your API key:

```python
# Server-side code (your proxy API)
@app.route("/api/openai", methods=["POST"])
def proxy_openai_request():
    # Validate the user's session/authentication
    if not is_authenticated(request):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Extract the request parameters
    request_data = request.json
    
    # Make the OpenAI API call using your server's API key
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    
    try:
        response = client.chat.completions.create(**request_data)
        return jsonify(response.model_dump())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

## API Request Structure Basics

Understanding the structure of API requests is fundamental to working effectively with the OpenAI API. Let's examine the basic components of a request:

### Common Request Parameters

Regardless of which API endpoint you're using, several parameters are commonly used:

1. **`model`**: Specifies which model to use (e.g., "gpt-4o", "gpt-3.5-turbo")
2. **Authentication**: Your API key, typically provided in the request header
3. **Request Body**: JSON payload containing the parameters specific to the endpoint

### Chat Completions Request Structure

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, who are you?"}
    ],
    temperature=0.7,
    max_tokens=150,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0
)
```

### Responses API Request Structure

```python
response = client.responses.create(
    model="gpt-4o",
    instructions="You are a helpful assistant.",
    input="Hello, who are you?",
    temperature=0.7,
    max_tokens=150
)
```

### Embeddings Request Structure

```python
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="The food was delicious and the service was excellent."
)
```

## Making Your First API Call

Let's put everything together and make your first API call. This example demonstrates a simple chat completion request:

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

# Make a simple request
def get_ai_response(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using a less expensive model for testing
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"An error occurred: {str(e)}"

# Test the function
if __name__ == "__main__":
    user_prompt = "Explain what an API is in simple terms."
    result = get_ai_response(user_prompt)
    print(f"Prompt: {user_prompt}\n")
    print(f"Response: {result}")
```

Save this code to a file (e.g., `first_api_call.py`), ensure your `.env` file contains your API key, and run it:

```bash
python first_api_call.py
```

If everything is set up correctly, you should receive a response explaining what an API is in simple terms.

## Understanding API Responses

When you make a request to the OpenAI API, the response contains several important components:

### Chat Completions Response Structure

```json
{
  "id": "chatcmpl-123abc",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-4o",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! I'm an AI assistant created by OpenAI. How can I help you today?"
      },
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 16,
    "total_tokens": 29
  }
}
```

### Responses API Response Structure

```json
{
  "id": "resp-123abc",
  "object": "response",
  "created": 1677858242,
  "model": "gpt-4o",
  "output_text": "Hello! I'm an AI assistant created by OpenAI. How can I help you today?",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 16,
    "total_tokens": 29
  }
}
```

### Key Response Fields

- **`id`**: A unique identifier for the response
- **`created`**: Timestamp of when the response was generated
- **`model`**: The model used to generate the response
- **`choices`** or **`output_text`**: The actual content generated by the model
- **`finish_reason`**: Indicates why the model stopped generating (e.g., "stop", "length", "content_filter")
- **`usage`**: Token usage information for billing purposes

Understanding these response structures will help you effectively integrate the OpenAI API into your applications and handle the responses appropriately.

In the next section, we'll explore the various models available through the OpenAI API and how to choose the right one for your specific use case.
# OpenAI Models in Depth

## Available Models Overview

OpenAI offers a diverse range of models through its API, each with unique capabilities, performance characteristics, and pricing. Understanding the differences between these models is crucial for selecting the right one for your specific use case. Here's a comprehensive overview of the main model families available:

### GPT-4 Family

The GPT-4 family represents OpenAI's most advanced models, offering superior reasoning, creativity, and instruction-following capabilities.

#### GPT-4o

GPT-4o ("o" for "omni") is OpenAI's flagship multimodal model, capable of processing both text and images with remarkable performance.

**Key Features:**
- Multimodal capabilities (text and image inputs)
- Improved reasoning and problem-solving
- Enhanced instruction following
- Reduced latency compared to previous GPT-4 models
- Competitive pricing relative to capabilities

**Best For:**
- Applications requiring both text and image understanding
- Complex reasoning tasks
- Production applications needing balanced performance and cost
- User-facing applications where response speed is important

#### GPT-4 Turbo

GPT-4 Turbo offers high performance with optimizations for faster response times and lower cost compared to the original GPT-4.

**Key Features:**
- Large 128K token context window
- Strong reasoning capabilities
- Good balance of performance and cost
- Support for function calling

**Best For:**
- Applications requiring processing of long documents
- Complex reasoning tasks with budget considerations
- Enterprise applications needing reliable performance

#### GPT-4

The original GPT-4 model, still available for applications that have been optimized for its specific characteristics.

**Key Features:**
- Consistent, well-tested performance
- Strong reasoning capabilities
- Reliable instruction following

**Best For:**
- Applications already optimized for GPT-4
- Use cases requiring the most consistent outputs

### GPT-3.5 Family

The GPT-3.5 family offers a more economical option while still providing strong capabilities for many common use cases.

#### GPT-3.5 Turbo

GPT-3.5 Turbo is OpenAI's most cost-effective model for general-purpose text generation and understanding.

**Key Features:**
- Fast response times
- Cost-effective pricing
- Good performance for straightforward tasks
- 16K token context window

**Best For:**
- High-volume applications with budget constraints
- Simpler conversational agents
- Content generation where absolute cutting-edge quality isn't required
- Prototyping and development

### Specialized Models

Beyond the general-purpose GPT models, OpenAI offers specialized models for specific tasks:

#### Text Embedding Models

Embedding models convert text into numerical vector representations that capture semantic meaning, enabling similarity comparisons and other vector operations.

**Available Models:**
- **text-embedding-3-small**: Efficient, cost-effective embeddings
- **text-embedding-3-large**: Higher-quality embeddings with more dimensions

**Best For:**
- Semantic search implementations
- Recommendation systems
- Document clustering
- Information retrieval

#### Moderation Models

Moderation models help identify potentially harmful or inappropriate content.

**Available Model:**
- **text-moderation-latest**: Classifies text across various harm categories

**Best For:**
- Content filtering
- User-generated content moderation
- Safety systems for AI applications

## Model Capabilities and Limitations

Understanding what each model can and cannot do is essential for setting appropriate expectations and designing effective applications.

### Common Capabilities Across Models

All OpenAI models share certain fundamental capabilities:

- **Natural Language Understanding**: Comprehending user inputs across various topics and domains
- **Text Generation**: Producing coherent, contextually relevant text
- **Conversation**: Maintaining context through multi-turn interactions
- **Instruction Following**: Responding to specific directions about how to complete a task

### Model-Specific Capabilities

Different models excel in different areas:

#### GPT-4o and GPT-4 Family

- **Complex Reasoning**: Multi-step problem solving and logical deduction
- **Nuanced Understanding**: Grasping subtle implications and context
- **Creative Generation**: Producing high-quality creative content
- **Code Generation**: Writing and explaining complex code
- **Multimodal Understanding** (GPT-4o): Processing and reasoning about images

#### GPT-3.5 Family

- **Straightforward Q&A**: Answering factual questions
- **Basic Content Generation**: Creating simple articles, emails, and summaries
- **Lightweight Conversation**: Handling straightforward dialogue
- **Simple Instructions**: Following clear, direct instructions

### Common Limitations

All current AI models, including OpenAI's, have certain limitations:

- **Knowledge Cutoff**: Models have a training cutoff date and lack knowledge of events after that date
- **Hallucinations**: Models may occasionally generate plausible-sounding but incorrect information
- **Reasoning Limitations**: Complex logical or mathematical reasoning may be inconsistent
- **Context Window Constraints**: Models can only consider a finite amount of text at once
- **Lack of True Understanding**: Models don't truly "understand" content the way humans do
- **No External Tools**: Models cannot access the internet, run code, or use external tools unless specifically enabled through API features

## Choosing the Right Model for Your Use Case

Selecting the appropriate model involves balancing several factors:

### Decision Factors

1. **Task Complexity**: More complex tasks generally benefit from more capable models
2. **Budget Constraints**: More capable models typically cost more per token
3. **Response Speed Requirements**: Some applications prioritize low latency
4. **Context Length Needs**: Consider how much context your application requires
5. **Multimodal Requirements**: Whether your application needs to process images

### Use Case Recommendations

Here are some common use cases and recommended models:

#### Customer Support Automation
- **Recommended**: GPT-3.5 Turbo for most queries, GPT-4o for complex issues
- **Rationale**: Cost-effective for high-volume, mostly straightforward queries

#### Content Creation
- **Recommended**: GPT-4o or GPT-4 Turbo
- **Rationale**: Higher quality output justifies the increased cost

#### Code Generation and Explanation
- **Recommended**: GPT-4o
- **Rationale**: Superior code generation capabilities and ability to understand code screenshots

#### Document Analysis
- **Recommended**: GPT-4 Turbo with 128K context
- **Rationale**: Can process longer documents in a single request

#### Semantic Search
- **Recommended**: text-embedding-3-large
- **Rationale**: Optimized specifically for creating high-quality text embeddings

#### Educational Applications
- **Recommended**: GPT-4o
- **Rationale**: Better reasoning and explanation capabilities, plus ability to understand visual materials

### Cost-Efficiency Strategies

To optimize your model selection for cost efficiency:

1. **Use Tiered Approach**: Start with GPT-3.5 Turbo and escalate to GPT-4 models only when needed
2. **Implement Caching**: Cache common responses to avoid redundant API calls
3. **Optimize Prompts**: Well-designed prompts can get better results from less expensive models
4. **Monitor Token Usage**: Regularly review token consumption to identify optimization opportunities

## Understanding Context Windows and Token Limits

The context window is a crucial concept in working with language models, as it determines how much information the model can consider at once.

### What Are Tokens?

Tokens are the basic units that models process:
- A token is approximately 4 characters or 3/4 of a word in English
- Punctuation, spaces, and special characters also count as tokens
- Code and non-English languages may tokenize differently

### Context Window Sizes

Different models have different context window sizes:
- GPT-4 Turbo: 128,000 tokens
- GPT-4o: 128,000 tokens
- GPT-3.5 Turbo: 16,384 tokens

### Managing Long Contexts

When working with content that exceeds the context window:

1. **Chunking**: Break long documents into smaller pieces
2. **Summarization**: Create summaries of previous context
3. **Retrieval-Augmented Generation (RAG)**: Only include relevant context based on the query
4. **Fine-tuning**: Train the model to work with specialized formats that convey information more efficiently

### Token Counting Example

```python
import tiktoken

def count_tokens(text, model="gpt-4o"):
    """Count the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)
    return len(tokens)

# Example usage
sample_text = "This is a sample text to demonstrate token counting."
token_count = count_tokens(sample_text)
print(f"The text contains {token_count} tokens.")
```

## Model Versioning and Deprecation Policies

OpenAI regularly updates its models and occasionally deprecates older versions. Understanding their versioning and deprecation policies is important for maintaining stable applications.

### Versioning Approach

OpenAI uses several approaches to versioning:

1. **Named Versions**: Major models get distinct names (e.g., GPT-4, GPT-4o)
2. **Suffixed Versions**: Variants may have suffixes (e.g., GPT-4 Turbo)
3. **Date-Based Versions**: Some models include dates (e.g., gpt-3.5-turbo-0125)
4. **Latest Pointers**: Aliases like "gpt-4-turbo" point to the latest version

### Deprecation Timeline

When a model is scheduled for deprecation:

1. OpenAI typically announces deprecation 3+ months in advance
2. The model remains available during this period
3. After deprecation, requests to that specific model version will fail

### Best Practices for Version Management

To handle model versioning effectively:

1. **Use Latest Pointers Carefully**: They provide automatic updates but may change behavior
2. **Monitor Announcements**: Subscribe to OpenAI's developer newsletter and monitor their blog
3. **Version Testing**: Test new versions before migrating production systems
4. **Graceful Fallbacks**: Implement fallback mechanisms if a model becomes unavailable

```python
# Example of version-aware client initialization
def get_openai_client(use_latest=False):
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    
    # Choose model version based on preference
    if use_latest:
        model = "gpt-4o"  # Latest pointer
    else:
        model = "gpt-4-0613"  # Specific version for stability
    
    return client, model

# Usage
client, model = get_openai_client(use_latest=False)
response = client.chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Latest Model Innovations

OpenAI continuously improves its models. Here are some of the latest innovations as of 2025:

### Multimodal Capabilities

The ability to process and reason about both text and images represents a significant advancement in AI capabilities:

- **Vision Understanding**: Models can analyze and describe images
- **Visual Reasoning**: Models can answer questions about visual content
- **Combined Inputs**: Processing text and images together for holistic understanding

### Enhanced Reasoning

Recent models show improved abilities in complex reasoning tasks:

- **Step-by-Step Problem Solving**: Breaking down complex problems methodically
- **Logical Consistency**: Maintaining coherent reasoning across complex scenarios
- **Self-Correction**: Identifying and fixing errors in reasoning

### Specialized Instruction Following

Models have become better at following specific instructions about how to respond:

- **Format Adherence**: Consistently producing outputs in requested formats
- **Style Matching**: Adopting specific tones or writing styles
- **Constraint Satisfaction**: Working within defined limitations

In the next section, we'll explore the core functionality of the OpenAI API, including detailed examples of how to use the Chat Completions and Responses APIs effectively.
# Core API Functionality

## Chat Completions API

The Chat Completions API is one of the primary interfaces for interacting with OpenAI's language models. It's designed around a conversational format, making it ideal for applications that involve dialogue or multi-turn interactions.

### Basic Usage and Parameters

At its most basic, a Chat Completions request requires a model name and a list of messages:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Hello, how are you today?"}
    ]
)

print(response.choices[0].message.content)
```

However, the API offers numerous parameters to control the generation process:

#### Essential Parameters

- **`model`** (string, required): Specifies which model to use (e.g., "gpt-4o", "gpt-3.5-turbo")
- **`messages`** (array, required): The conversation history formatted as an array of message objects
- **`temperature`** (number, optional, default 1): Controls randomness. Lower values make responses more deterministic, higher values more creative
- **`max_tokens`** (integer, optional): The maximum number of tokens to generate
- **`stream`** (boolean, optional, default false): Whether to stream back partial progress

#### Advanced Parameters

- **`top_p`** (number, optional, default 1): An alternative to temperature, using nucleus sampling
- **`n`** (integer, optional, default 1): How many chat completion choices to generate
- **`stop`** (string or array, optional): Sequences where the API will stop generating further tokens
- **`presence_penalty`** (number, optional, default 0): Penalizes new tokens based on whether they appear in the text so far
- **`frequency_penalty`** (number, optional, default 0): Penalizes new tokens based on their frequency in the text so far
- **`logit_bias`** (map, optional): Modifies the likelihood of specified tokens appearing in the completion
- **`tools`** (array, optional): List of tools the model may call
- **`tool_choice`** (string or object, optional): Controls how the model calls functions

### System, User, and Assistant Messages

The Chat Completions API uses a role-based message system to structure conversations:

1. **System Messages**: Set the behavior of the assistant
2. **User Messages**: Represent user inputs
3. **Assistant Messages**: Represent previous responses from the assistant
4. **Tool Messages**: Contain the results of tool calls

Here's an example using multiple message types:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that speaks like Shakespeare."},
        {"role": "user", "content": "Tell me about artificial intelligence."},
        {"role": "assistant", "content": "Verily, artificial intelligence doth mimic the workings of the human mind, yet 'tis crafted by mortal hands."},
        {"role": "user", "content": "How does it work?"}
    ]
)
```

### Temperature and Other Control Parameters

The generation behavior can be fine-tuned using various parameters:

#### Temperature

Temperature controls randomness in the model's outputs. Lower values make responses more deterministic and focused, while higher values introduce more creativity and variability.

```python
# More deterministic response
response_deterministic = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a tagline for a coffee shop."}],
    temperature=0.2
)

# More creative response
response_creative = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a tagline for a coffee shop."}],
    temperature=0.9
)
```

#### Top P (Nucleus Sampling)

An alternative to temperature, top_p controls diversity by considering only the tokens comprising the top p probability mass.

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a short poem about the ocean."}],
    top_p=0.8
)
```

#### Presence and Frequency Penalties

These parameters help control repetition in the generated text:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a paragraph about climate change."}],
    presence_penalty=0.5,  # Discourage repeating the same topics
    frequency_penalty=0.5   # Discourage repeating the same words
)
```

### Streaming Responses

For applications where you want to show responses as they're being generated (similar to typing), you can use streaming:

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a short story about a robot learning to paint."}],
    stream=True
)

# Process the stream
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

For asynchronous applications:

```python
import asyncio

async def stream_response():
    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Write a short story about a robot learning to paint."}],
        stream=True
    )
    
    async for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)

asyncio.run(stream_response())
```

### Code Examples and Use Cases

#### Building a Simple Chatbot

```python
def chatbot():
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    
    print("Chatbot: Hello! How can I help you today? (Type 'exit' to quit)")
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye!")
            break
        
        messages.append({"role": "user", "content": user_input})
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using a less expensive model for a chatbot
            messages=messages
        )
        
        assistant_response = response.choices[0].message.content
        print(f"Chatbot: {assistant_response}")
        
        # Add the assistant's response to the conversation history
        messages.append({"role": "assistant", "content": assistant_response})
```

#### Content Summarization

```python
def summarize_text(text, max_length="short"):
    length_instructions = {
        "short": "Summarize this in 2-3 sentences.",
        "medium": "Provide a paragraph-length summary.",
        "long": "Create a detailed summary with key points."
    }
    
    instruction = length_instructions.get(max_length, length_instructions["short"])
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are a summarization assistant. {instruction}"},
            {"role": "user", "content": text}
        ],
        temperature=0.3  # Lower temperature for more focused summaries
    )
    
    return response.choices[0].message.content
```

#### Language Translation

```python
def translate_text(text, source_language="auto", target_language="English"):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are a translation assistant. Translate the following text from {source_language} to {target_language}."},
            {"role": "user", "content": text}
        ]
    )
    
    return response.choices[0].message.content
```

## Responses API

The Responses API is OpenAI's newer interface for generating text, designed to simplify the developer experience while offering enhanced capabilities.

### When to Use Responses API vs Chat Completions

The Responses API is generally preferable when:
- You want a simpler interface with fewer required parameters
- You need to work with multimodal inputs (text and images)
- You prefer a more streamlined response format
- You're building new applications from scratch

The Chat Completions API remains better when:
- You need maximum control over generation parameters
- You're implementing complex function calling
- You require detailed token usage statistics
- You're maintaining existing applications built on this API

### Structure and Parameters

The Responses API has a more straightforward structure compared to Chat Completions:

```python
response = client.responses.create(
    model="gpt-4o",
    instructions="You are a helpful assistant.",
    input="What is artificial intelligence?",
    temperature=0.7,
    max_tokens=500
)

print(response.output_text)
```

#### Key Parameters

- **`model`** (string, required): Specifies which model to use
- **`instructions`** (string, optional): Provides system-level instructions for the model
- **`input`** (string or array, required): The user's input, which can be text or a structured array for multimodal inputs
- **`temperature`** (number, optional): Controls randomness in generation
- **`max_tokens`** (integer, optional): Maximum number of tokens to generate
- **`stream`** (boolean, optional): Whether to stream back partial progress

### Practical Examples

#### Basic Text Generation

```python
def get_response(prompt, instructions=None):
    response = client.responses.create(
        model="gpt-4o",
        instructions=instructions,
        input=prompt
    )
    
    return response.output_text
```

#### Multimodal Input (Text + Image)

```python
def analyze_image(image_url, prompt):
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": image_url}
                ]
            }
        ]
    )
    
    return response.output_text
```

#### Streaming with the Responses API

```python
stream = client.responses.create(
    model="gpt-4o",
    input="Explain quantum computing to a high school student.",
    stream=True
)

for event in stream:
    if hasattr(event, 'delta') and event.delta.output_text:
        print(event.delta.output_text, end="", flush=True)
```

#### Structured Conversation

```python
def structured_conversation(messages):
    # Convert chat-style messages to Responses API format
    if len(messages) == 1:
        # Single message case
        input_content = messages[0]["content"]
    else:
        # Multi-message conversation case
        input_content = []
        for msg in messages:
            input_content.append({
                "role": msg["role"],
                "content": [{"type": "input_text", "text": msg["content"]}]
            })
    
    response = client.responses.create(
        model="gpt-4o",
        input=input_content
    )
    
    return response.output_text
```

## Comparing API Approaches with Real Examples

To illustrate the differences between the Chat Completions API and the Responses API, let's implement the same functionality using both approaches:

### Example 1: Simple Question Answering

**Chat Completions API:**
```python
def answer_question_chat(question):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides accurate and concise answers."},
            {"role": "user", "content": question}
        ]
    )
    
    return response.choices[0].message.content
```

**Responses API:**
```python
def answer_question_responses(question):
    response = client.responses.create(
        model="gpt-4o",
        instructions="You are a helpful assistant that provides accurate and concise answers.",
        input=question
    )
    
    return response.output_text
```

### Example 2: Multi-turn Conversation

**Chat Completions API:**
```python
def chat_conversation(conversation_history, new_message):
    # Add the new message to the history
    conversation_history.append({"role": "user", "content": new_message})
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_history
    )
    
    assistant_message = response.choices[0].message.content
    
    # Update the conversation history
    conversation_history.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message, conversation_history
```

**Responses API:**
```python
def responses_conversation(conversation_history, new_message):
    # Format the conversation history for the Responses API
    formatted_input = []
    
    for message in conversation_history:
        formatted_input.append({
            "role": message["role"],
            "content": [{"type": "input_text", "text": message["content"]}]
        })
    
    # Add the new message
    formatted_input.append({
        "role": "user",
        "content": [{"type": "input_text", "text": new_message}]
    })
    
    response = client.responses.create(
        model="gpt-4o",
        input=formatted_input
    )
    
    assistant_message = response.output_text
    
    # Update the conversation history
    conversation_history.append({"role": "user", "content": new_message})
    conversation_history.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message, conversation_history
```

### Example 3: Content Generation with Specific Parameters

**Chat Completions API:**
```python
def generate_content_chat(prompt, creativity_level="medium"):
    # Map creativity level to temperature
    temperature_map = {
        "low": 0.3,
        "medium": 0.7,
        "high": 1.0
    }
    
    temperature = temperature_map.get(creativity_level, 0.7)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a creative content generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=temperature,
        max_tokens=500,
        presence_penalty=0.2,
        frequency_penalty=0.2
    )
    
    return response.choices[0].message.content
```

**Responses API:**
```python
def generate_content_responses(prompt, creativity_level="medium"):
    # Map creativity level to temperature
    temperature_map = {
        "low": 0.3,
        "medium": 0.7,
        "high": 1.0
    }
    
    temperature = temperature_map.get(creativity_level, 0.7)
    
    response = client.responses.create(
        model="gpt-4o",
        instructions="You are a creative content generator.",
        input=prompt,
        temperature=temperature,
        max_tokens=500
    )
    
    return response.output_text
```

In the next section, we'll explore advanced API features, including function calling, embeddings, and multimodal capabilities.
# Advanced API Features

## Function Calling

Function calling is a powerful capability that allows models to generate structured data and invoke external functions. This feature enables developers to create more interactive and capable applications by connecting AI models with external tools and services.

### Defining Functions for the Model to Call

To use function calling, you first need to define the functions that the model can call. These definitions include the function name, description, and parameter schema:

```python
import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

# Define the functions that the model can call
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The temperature unit to use",
                    },
                },
                "required": ["location"],
            },
        }
    }
]
```

### Handling Function Responses

Once you've defined the functions, you can make a request to the model and process any function calls it generates:

```python
def get_weather(location, unit="celsius"):
    """Get the current weather in a location (mock implementation)"""
    # In a real application, you would call a weather API here
    weather_data = {
        "location": location,
        "temperature": "22" if unit == "celsius" else "72",
        "unit": unit,
        "forecast": ["sunny", "windy"],
        "humidity": "65%"
    }
    return json.dumps(weather_data)

# Make a request to the model
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "What's the weather like in Boston?"}
    ],
    tools=tools,
    tool_choice="auto"  # Let the model decide when to call functions
)

# Check if the model wants to call a function
message = response.choices[0].message
tool_calls = message.tool_calls

if tool_calls:
    # The model wants to call a function
    available_functions = {
        "get_weather": get_weather,
    }
    
    # Prepare messages for the second request
    messages = [
        {"role": "user", "content": "What's the weather like in Boston?"},
        message  # Include the assistant's response with the function call
    ]
    
    # Process each function call
    for tool_call in tool_calls:
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)
        
        if function_name in available_functions:
            function_response = available_functions[function_name](**function_args)
            
            # Append the function response to the messages
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": function_name,
                "content": function_response
            })
    
    # Make a second request to get the final response
    second_response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    
    print(second_response.choices[0].message.content)
else:
    # The model didn't call a function
    print(message.content)
```

### Complex Function Calling Patterns

Function calling can be used in more complex scenarios, such as:

#### Multiple Functions

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "The city and state"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_restaurant_recommendations",
            "description": "Get restaurant recommendations for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "The city and state"},
                    "cuisine": {"type": "string", "description": "Type of cuisine"},
                    "price_range": {"type": "string", "enum": ["$", "$$", "$$$", "$$$$"]},
                },
                "required": ["location"],
            },
        }
    }
]
```

#### Forcing Specific Functions

You can force the model to use a specific function:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ],
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "get_weather"}}
)
```

#### Parallel Function Calling

The model can call multiple functions in a single response:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "What's the weather like in Miami, and can you recommend some Italian restaurants there?"}
    ],
    tools=tools,
    tool_choice="auto"
)

# Process multiple function calls in parallel
if response.choices[0].message.tool_calls:
    # Process each function call as shown earlier
    pass
```

### Real-World Examples

#### Building a Travel Assistant

```python
def travel_assistant():
    tools = [
        {
            "type": "function",
            "function": {
                "name": "search_flights",
                "description": "Search for flights between two cities on a specific date",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "origin": {"type": "string", "description": "Origin city or airport code"},
                        "destination": {"type": "string", "description": "Destination city or airport code"},
                        "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                        "passengers": {"type": "integer", "description": "Number of passengers"}
                    },
                    "required": ["origin", "destination", "date"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "search_hotels",
                "description": "Search for hotels in a city for specific dates",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "City name"},
                        "check_in": {"type": "string", "description": "Check-in date in YYYY-MM-DD format"},
                        "check_out": {"type": "string", "description": "Check-out date in YYYY-MM-DD format"},
                        "guests": {"type": "integer", "description": "Number of guests"}
                    },
                    "required": ["city", "check_in", "check_out"]
                }
            }
        }
    ]
    
    # Mock implementations of the functions
    def search_flights(origin, destination, date, passengers=1):
        return json.dumps({
            "flights": [
                {"airline": "Example Air", "departure": "10:00", "arrival": "12:00", "price": "$350"},
                {"airline": "Sample Airlines", "departure": "14:00", "arrival": "16:00", "price": "$310"}
            ]
        })
    
    def search_hotels(city, check_in, check_out, guests=1):
        return json.dumps({
            "hotels": [
                {"name": "Grand Hotel", "rating": 4.5, "price_per_night": "$200"},
                {"name": "City Center Inn", "rating": 4.2, "price_per_night": "$150"}
            ]
        })
    
    available_functions = {
        "search_flights": search_flights,
        "search_hotels": search_hotels
    }
    
    messages = [
        {"role": "system", "content": "You are a helpful travel assistant."}
    ]
    
    print("Travel Assistant: Hello! I can help you plan your trip. What are your travel plans?")
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("Travel Assistant: Goodbye! Have a great trip!")
            break
        
        messages.append({"role": "user", "content": user_input})
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        assistant_message = response.choices[0].message
        messages.append(assistant_message)
        
        # Process any function calls
        if assistant_message.tool_calls:
            for tool_call in assistant_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                function_response = available_functions[function_name](**function_args)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": function_response
                })
            
            # Get the final response after function calls
            final_response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            
            final_message = final_response.choices[0].message.content
            messages.append({"role": "assistant", "content": final_message})
            print(f"Travel Assistant: {final_message}")
        else:
            print(f"Travel Assistant: {assistant_message.content}")
```

## Embeddings

Embeddings are numerical representations of text that capture semantic meaning, allowing for operations like similarity comparison, clustering, and search.

### Understanding Vector Embeddings

Vector embeddings convert text into high-dimensional vectors where:
- Similar texts have vectors that are close together
- Different texts have vectors that are far apart
- The relationships between words and concepts are preserved in the vector space

This makes embeddings powerful for a wide range of applications:
- Semantic search
- Recommendation systems
- Document clustering
- Information retrieval
- Anomaly detection

### Creating and Using Embeddings

The OpenAI API provides dedicated embedding models that generate these vector representations:

```python
import os
import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

def get_embedding(text, model="text-embedding-3-small"):
    """Get the embedding for a given text"""
    response = client.embeddings.create(
        model=model,
        input=text
    )
    return response.data[0].embedding

# Example usage
text1 = "The cat sat on the mat."
text2 = "The feline rested on the rug."
text3 = "Quantum physics explores subatomic particles."

embedding1 = get_embedding(text1)
embedding2 = get_embedding(text2)
embedding3 = get_embedding(text3)

# Calculate cosine similarity between embeddings
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

similarity_1_2 = cosine_similarity(embedding1, embedding2)
similarity_1_3 = cosine_similarity(embedding1, embedding3)

print(f"Similarity between text1 and text2: {similarity_1_2}")
print(f"Similarity between text1 and text3: {similarity_1_3}")
```

### Semantic Search Implementation

One of the most common applications of embeddings is semantic search:

```python
def create_document_embeddings(documents, model="text-embedding-3-small"):
    """Create embeddings for a list of documents"""
    document_embeddings = {}
    
    for i, doc in enumerate(documents):
        embedding = get_embedding(doc, model)
        document_embeddings[i] = embedding
    
    return document_embeddings

def semantic_search(query, document_embeddings, documents, top_n=3):
    """Search for documents most similar to the query"""
    query_embedding = get_embedding(query)
    
    # Calculate similarities
    similarities = {}
    for idx, doc_embedding in document_embeddings.items():
        similarities[idx] = cosine_similarity(query_embedding, doc_embedding)
    
    # Sort by similarity
    sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    
    # Return top results
    results = []
    for idx, score in sorted_similarities[:top_n]:
        results.append({
            "document": documents[idx],
            "similarity_score": score
        })
    
    return results

# Example usage
documents = [
    "OpenAI was founded in December 2015.",
    "GPT stands for Generative Pre-trained Transformer.",
    "Python is a popular programming language for AI development.",
    "Machine learning models require large amounts of data for training.",
    "The transformer architecture revolutionized natural language processing."
]

document_embeddings = create_document_embeddings(documents)

query = "What is GPT?"
search_results = semantic_search(query, document_embeddings, documents)

for i, result in enumerate(search_results):
    print(f"Result {i+1}: {result['document']} (Score: {result['similarity_score']:.4f})")
```

### Similarity Comparison Techniques

Beyond cosine similarity, there are other techniques for comparing embeddings:

```python
def euclidean_distance(a, b):
    """Calculate Euclidean distance between two vectors"""
    return np.linalg.norm(np.array(a) - np.array(b))

def dot_product(a, b):
    """Calculate dot product between two vectors"""
    return np.dot(a, b)

# Example comparison
embedding_a = get_embedding("I love programming")
embedding_b = get_embedding("Coding is my passion")

print(f"Cosine similarity: {cosine_similarity(embedding_a, embedding_b)}")
print(f"Euclidean distance: {euclidean_distance(embedding_a, embedding_b)}")
print(f"Dot product: {dot_product(embedding_a, embedding_b)}")
```

## Image and Multimodal Capabilities

OpenAI's models have evolved to handle both text and images, enabling powerful multimodal applications.

### Processing Images with the API

The Responses API allows you to include images alongside text in your requests:

```python
import base64

def analyze_image_from_url(image_url, prompt):
    """Analyze an image from a URL"""
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": image_url}
                ]
            }
        ]
    )
    
    return response.output_text

def analyze_image_from_file(image_path, prompt):
    """Analyze an image from a local file"""
    # Read and encode the image
    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    
    # Format as a data URL
    data_url = f"data:image/jpeg;base64,{base64_image}"
    
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": data_url}
                ]
            }
        ]
    )
    
    return response.output_text
```

### Combined Text and Image Inputs

You can create more complex interactions by combining multiple images and text:

```python
def compare_images(image_url1, image_url2, prompt):
    """Compare two images based on a prompt"""
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": image_url1},
                    {"type": "input_image", "image_url": image_url2}
                ]
            }
        ]
    )
    
    return response.output_text
```

### Implementation Examples

#### Visual Question Answering

```python
def visual_qa_system():
    print("Visual Question Answering System")
    print("Enter 'exit' to quit")
    
    while True:
        image_url = input("\nEnter image URL (or path to local image): ")
        
        if image_url.lower() == 'exit':
            break
        
        question = input("Enter your question about the image: ")
        
        if question.lower() == 'exit':
            break
        
        # Determine if it's a URL or local path
        if image_url.startswith(('http://', 'https://')):
            result = analyze_image_from_url(image_url, question)
        else:
            try:
                result = analyze_image_from_file(image_url, question)
            except Exception as e:
                result = f"Error processing image: {str(e)}"
        
        print(f"\nAnswer: {result}")
```

#### Image-Based Content Generation

```python
def generate_content_from_image(image_url, content_type):
    """Generate content based on an image"""
    prompts = {
        "description": "Describe this image in detail.",
        "story": "Create a short story inspired by this image.",
        "social_post": "Write a social media post caption for this image.",
        "analysis": "Analyze the composition and elements of this image."
    }
    
    prompt = prompts.get(content_type, prompts["description"])
    
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": image_url}
                ]
            }
        ]
    )
    
    return response.output_text
```

#### Document Analysis System

```python
def analyze_document(document_image_url):
    """Extract and analyze information from a document image"""
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": "Extract all text from this document. Then identify key information such as names, dates, amounts, and summarize the main content."},
                    {"type": "input_image", "image_url": document_image_url}
                ]
            }
        ]
    )
    
    return response.output_text
```

In the next section, we'll explore specialized API services, including the Assistants API, fine-tuning, and the Moderation API.
# Specialized API Services

## Assistants API

The Assistants API provides a higher-level interface for building AI assistants with persistent memory and specialized tools. It's designed to simplify the development of complex, stateful AI applications.

### Creating and Managing Assistants

An Assistant is a persistent entity with specific instructions, capabilities, and tools:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

# Create an assistant
assistant = client.beta.assistants.create(
    name="Math Tutor",
    instructions="You are a personal math tutor. Explain concepts in simple terms and provide step-by-step guidance for solving problems.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}]
)

print(f"Created assistant with ID: {assistant.id}")

# Retrieve an assistant
retrieved_assistant = client.beta.assistants.retrieve(assistant.id)

# Update an assistant
updated_assistant = client.beta.assistants.update(
    assistant.id,
    instructions="You are a personal math tutor. Explain concepts in simple terms, provide step-by-step guidance, and use examples to illustrate mathematical principles.",
    model="gpt-4o"
)

# List assistants
assistants = client.beta.assistants.list(
    order="desc",
    limit=10
)

for assistant in assistants.data:
    print(f"Assistant: {assistant.name}, ID: {assistant.id}")

# Delete an assistant
client.beta.assistants.delete(assistant.id)
```

### Threads and Messages

Threads maintain conversation history and state across multiple interactions:

```python
# Create a thread
thread = client.beta.threads.create()
print(f"Created thread with ID: {thread.id}")

# Add a message to the thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="I'm having trouble understanding how to solve quadratic equations."
)

# Retrieve messages from a thread
messages = client.beta.threads.messages.list(
    thread_id=thread.id
)

for message in messages.data:
    print(f"Role: {message.role}, Content: {message.content[0].text.value}")

# Run the assistant on the thread
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
)

# Check the run status
run_status = client.beta.threads.runs.retrieve(
    thread_id=thread.id,
    run_id=run.id
)

print(f"Run status: {run_status.status}")

# Once completed, retrieve the assistant's response
if run_status.status == "completed":
    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )
    
    # The latest message will be the assistant's response
    latest_message = messages.data[0]
    if latest_message.role == "assistant":
        print(f"Assistant's response: {latest_message.content[0].text.value}")
```

### Tools (Code Interpreter, Retrieval, Function Calling)

Assistants can be equipped with various tools to enhance their capabilities:

#### Code Interpreter

```python
# Create an assistant with code interpreter
code_assistant = client.beta.assistants.create(
    name="Python Coding Assistant",
    instructions="You are a Python programming assistant. Help users write, debug, and optimize Python code.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}]
)

# Create a thread with a coding question
thread = client.beta.threads.create()
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Can you write a Python function to calculate the Fibonacci sequence up to n terms?"
)

# Run the assistant
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=code_assistant.id
)

# In a real application, you would poll for completion
# For demonstration, we assume the run completes successfully
```

#### Retrieval

```python
# Upload a file for retrieval
file = client.files.create(
    file=open("math_textbook.pdf", "rb"),
    purpose="assistants"
)

# Create an assistant with retrieval
retrieval_assistant = client.beta.assistants.create(
    name="Math Textbook Assistant",
    instructions="You are a helpful teaching assistant. Use the provided textbook to answer questions about mathematics.",
    model="gpt-4o",
    tools=[{"type": "retrieval"}],
    file_ids=[file.id]
)

# Create a thread with a question about the textbook
thread = client.beta.threads.create()
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="What does the textbook say about the quadratic formula?"
)

# Run the assistant
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=retrieval_assistant.id
)
```

#### Function Calling

```python
# Define functions for the assistant to call
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get the current stock price for a given ticker symbol",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock ticker symbol (e.g., AAPL for Apple)"
                    }
                },
                "required": ["symbol"]
            }
        }
    }
]

# Create an assistant with function calling
function_assistant = client.beta.assistants.create(
    name="Financial Assistant",
    instructions="You are a financial advisor assistant. Help users with investment questions and provide stock information when requested.",
    model="gpt-4o",
    tools=tools
)

# Create a thread with a question about stocks
thread = client.beta.threads.create()
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="What's the current price of Apple stock?"
)

# Run the assistant
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=function_assistant.id
)

# In a real application, you would need to handle the function call
# For example:
def handle_function_calls(thread_id, run_id):
    run_status = client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id
    )
    
    if run_status.status == "requires_action":
        tool_calls = run_status.required_action.submit_tool_outputs.tool_calls
        tool_outputs = []
        
        for tool_call in tool_calls:
            if tool_call.function.name == "get_stock_price":
                # In a real application, you would call an actual stock API
                symbol = json.loads(tool_call.function.arguments)["symbol"]
                price = "150.25"  # Mock price
                
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": json.dumps({"price": price, "currency": "USD"})
                })
        
        # Submit the outputs back to the assistant
        client.beta.threads.runs.submit_tool_outputs(
            thread_id=thread_id,
            run_id=run_id,
            tool_outputs=tool_outputs
        )
```

### Implementation Examples

#### Building a Customer Support Assistant

```python
def create_customer_support_assistant():
    # Upload knowledge base documents
    faq_file = client.files.create(
        file=open("product_faq.pdf", "rb"),
        purpose="assistants"
    )
    
    manual_file = client.files.create(
        file=open("user_manual.pdf", "rb"),
        purpose="assistants"
    )
    
    # Define functions for the assistant
    tools = [
        {
            "type": "function",
            "function": {
                "name": "check_order_status",
                "description": "Check the status of a customer's order",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "order_id": {
                            "type": "string",
                            "description": "The order ID to check"
                        }
                    },
                    "required": ["order_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "create_return_request",
                "description": "Create a return request for a product",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "order_id": {
                            "type": "string",
                            "description": "The order ID"
                        },
                        "product_id": {
                            "type": "string",
                            "description": "The product ID to return"
                        },
                        "reason": {
                            "type": "string",
                            "description": "Reason for the return"
                        }
                    },
                    "required": ["order_id", "product_id", "reason"]
                }
            }
        }
    ]
    
    # Create the assistant
    assistant = client.beta.assistants.create(
        name="Product Support Assistant",
        instructions="""You are a customer support assistant for our electronics company.
        Help customers with product questions, order issues, and return requests.
        Use the knowledge base to answer product-specific questions.
        Be friendly, concise, and helpful.""",
        model="gpt-4o",
        tools=tools + [{"type": "retrieval"}],
        file_ids=[faq_file.id, manual_file.id]
    )
    
    return assistant.id

# Function implementations for the assistant to call
def check_order_status(order_id):
    # In a real application, this would query an order database
    statuses = {
        "ORD12345": "Shipped - Expected delivery on April 5, 2025",
        "ORD12346": "Processing - Will ship within 24 hours",
        "ORD12347": "Delivered on March 30, 2025"
    }
    
    return json.dumps({
        "order_id": order_id,
        "status": statuses.get(order_id, "Order not found"),
        "last_updated": "2025-04-03T12:00:00Z"
    })

def create_return_request(order_id, product_id, reason):
    # In a real application, this would create a return in your system
    return_id = "RET" + str(random.randint(10000, 99999))
    
    return json.dumps({
        "return_id": return_id,
        "order_id": order_id,
        "product_id": product_id,
        "status": "Created",
        "instructions": "Please print the return label and ship the product back within 14 days."
    })
```

## Fine-tuning

Fine-tuning allows you to customize OpenAI's models for specific use cases by training them on your own data.

### When and Why to Fine-tune Models

Fine-tuning is beneficial when:

1. **Consistent Formatting**: You need responses in a specific, consistent format
2. **Domain Adaptation**: You want the model to excel in a specialized domain
3. **Custom Tone or Style**: You need responses in a particular voice or style
4. **Improved Performance**: You want better results on specific tasks than prompting alone can achieve
5. **Reduced Token Usage**: You want to achieve better results with shorter prompts

### Preparing Training Data

Training data for fine-tuning should be formatted as a list of conversation examples:

```python
# Example training data for a customer support assistant
training_data = [
    {
        "messages": [
            {"role": "system", "content": "You are a customer support agent for Acme Electronics."},
            {"role": "user", "content": "My laptop won't turn on."},
            {"role": "assistant", "content": "I'm sorry to hear that your Acme laptop is not turning on. Let's troubleshoot this issue together. First, please try these steps:\n\n1. Make sure the laptop is charged by connecting it to power. Look for a light indicator showing it's receiving power.\n2. Press and hold the power button for 10 seconds, then release and try turning it on again.\n3. If possible, remove the battery, wait 30 seconds, reinsert it, and try again.\n\nCould you let me know if any of these steps help or if you notice any lights or sounds when attempting to power on?"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a customer support agent for Acme Electronics."},
            {"role": "user", "content": "How do I connect my Acme Smart TV to WiFi?"},
            {"role": "assistant", "content": "Connecting your Acme Smart TV to WiFi is a straightforward process. Here's how to do it:\n\n1. Press the Home button on your remote control\n2. Navigate to Settings (usually a gear icon)\n3. Select Network & Internet or Network Settings\n4. Choose WiFi and turn it on if it isn't already\n5. Select your WiFi network from the list\n6. Enter your WiFi password using the on-screen keyboard\n7. Select Connect or OK\n\nYour TV should connect within a few moments. If you encounter any issues, make sure your WiFi password is correct and that your router is functioning properly. Is there anything specific about this process you're having trouble with?"}
        ]
    }
]

# Save the training data to a JSONL file
import json

with open("support_training_data.jsonl", "w") as f:
    for example in training_data:
        f.write(json.dumps(example) + "\n")
```

### Creating and Managing Fine-tuning Jobs

Once your training data is prepared, you can create a fine-tuning job:

```python
# Upload the training file
training_file = client.files.create(
    file=open("support_training_data.jsonl", "rb"),
    purpose="fine-tuning"
)

# Create a fine-tuning job
fine_tuning_job = client.fine_tuning.jobs.create(
    training_file=training_file.id,
    model="gpt-3.5-turbo",  # Base model to fine-tune
    suffix="acme-support"   # Custom suffix for your fine-tuned model
)

print(f"Fine-tuning job created: {fine_tuning_job.id}")

# Check the status of the fine-tuning job
job_status = client.fine_tuning.jobs.retrieve(fine_tuning_job.id)
print(f"Status: {job_status.status}")

# List all fine-tuning jobs
jobs = client.fine_tuning.jobs.list()
for job in jobs.data:
    print(f"Job ID: {job.id}, Model: {job.model}, Status: {job.status}")
```

### Using Fine-tuned Models

Once your fine-tuning job is complete, you can use your custom model:

```python
# Get the fine-tuned model name from the job
job = client.fine_tuning.jobs.retrieve(fine_tuning_job.id)
fine_tuned_model = job.fine_tuned_model

# Use the fine-tuned model
response = client.chat.completions.create(
    model=fine_tuned_model,
    messages=[
        {"role": "system", "content": "You are a customer support agent for Acme Electronics."},
        {"role": "user", "content": "My Acme headphones won't connect to my phone."}
    ]
)

print(response.choices[0].message.content)
```

### Cost Considerations

Fine-tuning involves both upfront training costs and usage costs:

1. **Training Costs**: Based on the number of tokens in your training data
2. **Usage Costs**: Typically higher per token than base models
3. **Model Hosting**: Fine-tuned models are hosted until you delete them

To optimize costs:

```python
import tiktoken

def estimate_fine_tuning_cost(file_path, model="gpt-3.5-turbo"):
    """Estimate the cost of fine-tuning based on token count"""
    # Approximate costs (check OpenAI's pricing page for current rates)
    training_cost_per_1k_tokens = 0.008  # for gpt-3.5-turbo
    if model == "gpt-4":
        training_cost_per_1k_tokens = 0.03
    
    encoding = tiktoken.encoding_for_model(model)
    total_tokens = 0
    
    with open(file_path, "r") as f:
        for line in f:
            example = json.loads(line)
            for message in example["messages"]:
                total_tokens += len(encoding.encode(message["content"]))
                # Add 4 tokens for message metadata
                total_tokens += 4
            # Add 2 tokens for conversation metadata
            total_tokens += 2
    
    estimated_cost = (total_tokens / 1000) * training_cost_per_1k_tokens
    
    return {
        "total_tokens": total_tokens,
        "estimated_cost_usd": estimated_cost
    }

# Example usage
cost_estimate = estimate_fine_tuning_cost("support_training_data.jsonl")
print(f"Estimated fine-tuning cost: ${cost_estimate['estimated_cost_usd']:.2f}")
```

## Moderation API

The Moderation API helps identify potentially harmful or inappropriate content to ensure responsible AI use.

### Content Filtering Capabilities

The Moderation API classifies text across several harm categories:

1. **Hate**: Content expressing hatred or discrimination
2. **Harassment**: Content intended to harass, intimidate, or bully
3. **Self-harm**: Content promoting self-harm or suicide
4. **Sexual**: Sexually explicit content
5. **Violence**: Content depicting or promoting violence
6. **Violent/hate**: Content that is both violent and hateful

### Implementation in Production Applications

Here's how to integrate the Moderation API into your applications:

```python
def check_content_moderation(text):
    """Check if content violates content policy"""
    try:
        response = client.moderations.create(input=text)
        result = response.results[0]
        
        # Check if the content is flagged
        if result.flagged:
            flagged_categories = []
            for category, flagged in result.categories.items():
                if flagged:
                    score = getattr(result.category_scores, category)
                    flagged_categories.append(f"{category} ({score:.4f})")
            
            return {
                "flagged": True,
                "categories": flagged_categories
            }
        else:
            return {"flagged": False}
    except Exception as e:
        return {"error": str(e)}

# Example usage
def moderate_user_input():
    print("Content Moderation Demo (type 'exit' to quit)")
    
    while True:
        user_input = input("\nEnter text to check: ")
        
        if user_input.lower() == 'exit':
            break
        
        # Check content before processing
        moderation_result = check_content_moderation(user_input)
        
        if "error" in moderation_result:
            print(f"Error: {moderation_result['error']}")
        elif moderation_result["flagged"]:
            print("⚠️ Content flagged for the following categories:")
            for category in moderation_result["categories"]:
                print(f"- {category}")
            print("This content may violate our content policy.")
        else:
            print("✅ Content passed moderation checks.")
            
            # Process the content with the OpenAI API
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_input}]
            )
            
            print(f"\nResponse: {response.choices[0].message.content}")
```

### Handling Flagged Content

When content is flagged, you have several options:

```python
def handle_flagged_content(text, moderation_result):
    """Handle content that has been flagged by the moderation API"""
    if not moderation_result["flagged"]:
        # Content is safe, process normally
        return process_safe_content(text)
    
    # Get the flagged categories
    categories = moderation_result["categories"]
    
    # Different handling strategies based on category and severity
    if any("hate" in category.lower() for category in categories):
        return {
            "status": "rejected",
            "message": "We cannot process content that contains hateful language."
        }
    elif any("sexual" in category.lower() for category in categories):
        return {
            "status": "rejected",
            "message": "We cannot process content that contains explicit sexual content."
        }
    elif any("violence" in category.lower() for category in categories):
        return {
            "status": "rejected",
            "message": "We cannot process content that contains violent content."
        }
    elif any("self-harm" in category.lower() for category in categories):
        return {
            "status": "referred",
            "message": "If you're experiencing thoughts of self-harm, please contact a mental health professional or call a crisis helpline."
        }
    else:
        # For other categories or lower severity, you might warn but still process
        return {
            "status": "warned",
            "message": "Some aspects of your content may be inappropriate. We've processed your request, but please review our content guidelines.",
            "result": process_safe_content(text)
        }

def process_safe_content(text):
    """Process content that has passed moderation checks"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": text}]
    )
    
    return {
        "status": "processed",
        "result": response.choices[0].message.content
    }
```

### Pre-emptive Moderation System

For a more robust approach, implement pre-emptive moderation:

```python
class ContentModerationSystem:
    def __init__(self, openai_client):
        self.client = openai_client
        self.moderation_log = []
    
    def moderate_content(self, content, user_id=None):
        """Moderate content and log the result"""
        response = self.client.moderations.create(input=content)
        result = response.results[0]
        
        # Log the moderation result
        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "user_id": user_id,
            "content_preview": content[:50] + "..." if len(content) > 50 else content,
            "flagged": result.flagged,
            "categories": {k: v for k, v in result.categories.items() if v},
            "category_scores": {k: getattr(result.category_scores, k) for k in result.categories.__dict__ if getattr(result.categories, k)}
        }
        
        self.moderation_log.append(log_entry)
        
        return result
    
    def process_user_request(self, user_id, content):
        """Process a user request with moderation"""
        # First, check the content
        moderation_result = self.moderate_content(content, user_id)
        
        if moderation_result.flagged:
            # Content is flagged, determine how to handle it
            high_severity = any(
                getattr(moderation_result.category_scores, category) > 0.8
                for category in moderation_result.categories.__dict__
                if getattr(moderation_result.categories, category)
            )
            
            if high_severity:
                return {
                    "status": "rejected",
                    "message": "Your request contains content that violates our usage policies."
                }
            else:
                return {
                    "status": "warning",
                    "message": "Your request contains potentially inappropriate content. Please review our content guidelines."
                }
        
        # Content passed moderation, process the request
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": content}]
            )
            
            # Also moderate the response to ensure it's appropriate
            response_text = response.choices[0].message.content
            response_moderation = self.moderate_content(response_text, "system")
            
            if response_moderation.flagged:
                # The AI generated inappropriate content
                return {
                    "status": "error",
                    "message": "We couldn't generate an appropriate response. Please try rephrasing your request."
                }
            
            return {
                "status": "success",
                "response": response_text
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }
    
    def get_moderation_stats(self):
        """Get statistics about moderation results"""
        total_requests = len(self.moderation_log)
        flagged_requests = sum(1 for entry in self.moderation_log if entry["flagged"])
        
        category_counts = {}
        for entry in self.moderation_log:
            if entry["flagged"]:
                for category in entry["categories"]:
                    category_counts[category] = category_counts.get(category, 0) + 1
        
        return {
            "total_requests": total_requests,
            "flagged_requests": flagged_requests,
            "flagged_percentage": (flagged_requests / total_requests * 100) if total_requests > 0 else 0,
            "category_breakdown": category_counts
        }
```

In the next section, we'll explore error handling and best practices for working with the OpenAI API.
# Error Handling and Best Practices

## Common API Errors and How to Handle Them

When working with the OpenAI API, you'll inevitably encounter errors. Understanding these errors and implementing proper handling strategies is crucial for building robust applications.

### Authentication Errors

Authentication errors occur when there are issues with your API key:

```python
import os
from openai import OpenAI, AuthenticationError

def handle_authentication_error():
    try:
        # Intentionally use an invalid API key
        client = OpenAI(
            api_key="invalid_key"
        )
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello"}]
        )
    except AuthenticationError as e:
        print(f"Authentication Error: {e}")
        print("Please check your API key and ensure it's valid.")
        # In a production application, you might:
        # 1. Log the error
        # 2. Alert administrators
        # 3. Prompt the user to re-enter credentials
        # 4. Fall back to a non-API solution
```

### Rate Limit Errors

Rate limit errors occur when you exceed OpenAI's request limits:

```python
from openai import RateLimitError
import time

def handle_rate_limit_error(max_retries=5):
    retries = 0
    backoff_time = 1  # Start with 1 second backoff
    
    while retries < max_retries:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hello"}]
            )
            return response
        except RateLimitError as e:
            retries += 1
            print(f"Rate limit exceeded. Retrying in {backoff_time} seconds... (Attempt {retries}/{max_retries})")
            
            if retries == max_retries:
                print("Maximum retry attempts reached. Please try again later.")
                raise e
            
            time.sleep(backoff_time)
            backoff_time *= 2  # Exponential backoff
```

### Invalid Request Errors

Invalid request errors occur when your request parameters are incorrect:

```python
from openai import BadRequestError

def handle_invalid_request():
    try:
        # Intentionally use an invalid model name
        response = client.chat.completions.create(
            model="non-existent-model",
            messages=[{"role": "user", "content": "Hello"}]
        )
    except BadRequestError as e:
        print(f"Invalid Request Error: {e}")
        
        # Extract error details
        error_message = str(e)
        
        if "model" in error_message.lower():
            print("The specified model does not exist or is not available.")
            # Fall back to a known working model
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",  # Fallback to a reliable model
                    messages=[{"role": "user", "content": "Hello"}]
                )
                print("Successfully used fallback model.")
                return response
            except Exception as fallback_error:
                print(f"Fallback also failed: {fallback_error}")
```

### Server Errors

Server errors occur when there's an issue on OpenAI's end:

```python
from openai import APIError

def handle_server_error(max_retries=3):
    retries = 0
    
    while retries < max_retries:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hello"}]
            )
            return response
        except APIError as e:
            retries += 1
            wait_time = 2 ** retries  # Exponential backoff
            
            print(f"API Error: {e}")
            print(f"Retrying in {wait_time} seconds... (Attempt {retries}/{max_retries})")
            
            if retries == max_retries:
                print("Maximum retry attempts reached.")
                raise e
            
            time.sleep(wait_time)
```

### Timeout Errors

Timeout errors occur when a request takes too long to complete:

```python
from openai import APITimeoutError

def handle_timeout_error(max_retries=3):
    retries = 0
    
    while retries < max_retries:
        try:
            # Set a shorter timeout for demonstration
            client = OpenAI(
                api_key=os.environ.get("OPENAI_API_KEY"),
                timeout=5.0  # 5 second timeout
            )
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Write a detailed essay on quantum physics"}]
            )
            return response
        except APITimeoutError as e:
            retries += 1
            print(f"Timeout Error: {e}")
            print(f"Retrying... (Attempt {retries}/{max_retries})")
            
            if retries == max_retries:
                print("Maximum retry attempts reached.")
                # Consider simplifying the request or using a different approach
                raise e
```

### Comprehensive Error Handling

Here's a comprehensive approach to handling various API errors:

```python
import os
import time
import logging
from openai import OpenAI, AuthenticationError, RateLimitError, APIError, BadRequestError, APITimeoutError, APIConnectionError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("openai_api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("openai_api")

def create_openai_client():
    """Create an OpenAI client with proper error handling"""
    try:
        client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        return client
    except Exception as e:
        logger.error(f"Failed to initialize OpenAI client: {e}")
        raise

def make_api_request(client, messages, model="gpt-3.5-turbo", max_retries=3, initial_backoff=1):
    """Make an API request with comprehensive error handling and retries"""
    retries = 0
    backoff_time = initial_backoff
    
    while True:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response
        except AuthenticationError as e:
            logger.error(f"Authentication Error: {e}")
            raise  # Authentication errors should not be retried
        except RateLimitError as e:
            retries += 1
            logger.warning(f"Rate Limit Error: {e}. Attempt {retries}/{max_retries}")
            
            if retries >= max_retries:
                logger.error("Maximum retry attempts reached for rate limit error.")
                raise
            
            # Exponential backoff with jitter
            jitter = random.uniform(0, 0.1 * backoff_time)
            sleep_time = backoff_time + jitter
            logger.info(f"Retrying in {sleep_time:.2f} seconds...")
            time.sleep(sleep_time)
            backoff_time *= 2
        except APITimeoutError as e:
            retries += 1
            logger.warning(f"Timeout Error: {e}. Attempt {retries}/{max_retries}")
            
            if retries >= max_retries:
                logger.error("Maximum retry attempts reached for timeout error.")
                raise
            
            time.sleep(backoff_time)
            backoff_time *= 1.5  # Slightly gentler backoff for timeouts
        except APIConnectionError as e:
            retries += 1
            logger.warning(f"Connection Error: {e}. Attempt {retries}/{max_retries}")
            
            if retries >= max_retries:
                logger.error("Maximum retry attempts reached for connection error.")
                raise
            
            time.sleep(backoff_time)
            backoff_time *= 2
        except BadRequestError as e:
            logger.error(f"Bad Request Error: {e}")
            
            # Check if it's a model error and try to fall back
            error_message = str(e).lower()
            if "model" in error_message and model != "gpt-3.5-turbo":
                logger.info(f"Attempting to fall back to gpt-3.5-turbo model")
                return make_api_request(client, messages, model="gpt-3.5-turbo", max_retries=max_retries)
            else:
                raise  # Other bad requests should not be retried
        except APIError as e:
            retries += 1
            logger.warning(f"API Error: {e}. Attempt {retries}/{max_retries}")
            
            if retries >= max_retries:
                logger.error("Maximum retry attempts reached for API error.")
                raise
            
            time.sleep(backoff_time)
            backoff_time *= 2
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise
```

## Rate Limits and How to Work Within Them

OpenAI imposes rate limits to ensure fair usage and system stability. Understanding and working within these limits is essential for reliable applications.

### Understanding Rate Limits

Rate limits are applied at several levels:

1. **Requests per Minute (RPM)**: Limits the number of API requests you can make per minute
2. **Tokens per Minute (TPM)**: Limits the total number of tokens (input + output) processed per minute
3. **Tier-Based Limits**: Different account tiers have different rate limits

### Implementing Retry Mechanisms

A robust retry mechanism is essential for handling rate limit errors:

```python
import time
import random
from openai import RateLimitError

def retry_with_exponential_backoff(
    func,
    initial_delay=1,
    exponential_base=2,
    jitter=True,
    max_retries=10
):
    """Retry a function with exponential backoff."""
    
    def wrapper(*args, **kwargs):
        # Initialize variables
        num_retries = 0
        delay = initial_delay
        
        # Loop until a successful response or max_retries is hit
        while True:
            try:
                return func(*args, **kwargs)
            
            # Retry on rate limit errors
            except RateLimitError as e:
                # Increment retries
                num_retries += 1
                
                # Check if max retries has been reached
                if num_retries > max_retries:
                    raise Exception(f"Maximum number of retries ({max_retries}) exceeded.")
                
                # Increment the delay
                delay *= exponential_base * (1 + jitter * random.random())
                
                # Sleep for the delay
                time.sleep(delay)
            
            # Raise other errors
            except Exception as e:
                raise e
    
    return wrapper

# Example usage
@retry_with_exponential_backoff
def make_openai_request(prompt):
    return client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
```

### Batching Requests Efficiently

Batching requests can help you stay within rate limits while maximizing throughput:

```python
import asyncio
from openai import AsyncOpenAI

async def process_batch(prompts, batch_size=5, delay_between_batches=1):
    """Process a large number of prompts in batches"""
    client = AsyncOpenAI(
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    
    results = []
    
    # Process prompts in batches
    for i in range(0, len(prompts), batch_size):
        batch = prompts[i:i+batch_size]
        batch_results = []
        
        # Create tasks for concurrent processing
        tasks = [
            process_single_prompt(client, prompt)
            for prompt in batch
        ]
        
        # Execute batch concurrently
        batch_results = await asyncio.gather(*tasks, return_exceptions=True)
        results.extend(batch_results)
        
        # Delay between batches to avoid rate limits
        if i + batch_size < len(prompts):
            print(f"Processed batch {i//batch_size + 1}/{(len(prompts) + batch_size - 1)//batch_size}. Waiting...")
            await asyncio.sleep(delay_between_batches)
    
    return results

async def process_single_prompt(client, prompt):
    """Process a single prompt with error handling"""
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

# Example usage
async def main():
    prompts = [
        "Write a haiku about mountains",
        "Explain quantum computing",
        "Write a short story about a robot",
        # ... more prompts
    ]
    
    results = await process_batch(prompts, batch_size=3, delay_between_batches=2)
    
    for i, result in enumerate(results):
        print(f"Result {i+1}: {result}")

# Run the async function
asyncio.run(main())
```

### Caching Strategies

Implementing caching can significantly reduce API calls for repeated or similar requests:

```python
import hashlib
import json
import redis

class OpenAICache:
    def __init__(self, redis_url="redis://localhost:6379/0", expire_time=86400):
        """Initialize cache with Redis backend"""
        self.redis_client = redis.from_url(redis_url)
        self.expire_time = expire_time  # Cache expiration in seconds (default: 24 hours)
    
    def _generate_cache_key(self, model, messages, temperature=None):
        """Generate a unique cache key based on request parameters"""
        # Create a dictionary of the parameters that affect the response
        cache_dict = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }
        
        # Convert to a stable string representation and hash it
        cache_str = json.dumps(cache_dict, sort_keys=True)
        return f"openai:cache:{hashlib.md5(cache_str.encode()).hexdigest()}"
    
    def get_cached_response(self, model, messages, temperature=None):
        """Get a cached response if available"""
        cache_key = self._generate_cache_key(model, messages, temperature)
        cached_data = self.redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        return None
    
    def cache_response(self, model, messages, response, temperature=None):
        """Cache a response"""
        cache_key = self._generate_cache_key(model, messages, temperature)
        
        # Store only the necessary parts of the response
        cache_data = {
            "choices": response.choices,
            "model": response.model,
            "usage": response.usage
        }
        
        self.redis_client.setex(
            cache_key,
            self.expire_time,
            json.dumps(cache_data)
        )

# Example usage
def get_completion_with_cache(prompt, cache, model="gpt-3.5-turbo", temperature=0.7):
    """Get a completion with caching"""
    messages = [{"role": "user", "content": prompt}]
    
    # Check cache first
    cached_response = cache.get_cached_response(model, messages, temperature)
    if cached_response:
        print("Using cached response")
        return cached_response["choices"][0]["message"]["content"]
    
    # If not in cache, make API call
    print("Making API call")
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature
    )
    
    # Cache the response
    cache.cache_response(model, messages, response, temperature)
    
    return response.choices[0].message.content
```

## Logging and Monitoring API Usage

Proper logging and monitoring are essential for tracking API usage, debugging issues, and optimizing costs.

### Setting Up Comprehensive Logging

```python
import logging
import time
import uuid
from datetime import datetime

class APILogger:
    def __init__(self, log_file="openai_api.log"):
        """Initialize the API logger"""
        # Configure logging
        self.logger = logging.getLogger("openai_api")
        self.logger.setLevel(logging.INFO)
        
        # File handler
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.WARNING)
        
        # Formatter
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def log_request(self, model, messages, temperature=None, max_tokens=None):
        """Log an API request"""
        request_id = str(uuid.uuid4())
        request_time = datetime.now().isoformat()
        
        # Calculate input tokens (approximate)
        input_tokens = sum(len(m["content"].split()) * 1.3 for m in messages)
        
        log_data = {
            "request_id": request_id,
            "timestamp": request_time,
            "model": model,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "input_tokens_approx": int(input_tokens),
            "messages_count": len(messages)
        }
        
        self.logger.info(f"API Request: {json.dumps(log_data)}")
        return request_id
    
    def log_response(self, request_id, response, elapsed_time):
        """Log an API response"""
        response_time = datetime.now().isoformat()
        
        # Extract relevant information from the response
        if hasattr(response, "usage"):
            usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        else:
            usage = {"total_tokens": "unknown"}
        
        log_data = {
            "request_id": request_id,
            "timestamp": response_time,
            "elapsed_time_ms": int(elapsed_time * 1000),
            "model": response.model,
            "usage": usage
        }
        
        self.logger.info(f"API Response: {json.dumps(log_data)}")
    
    def log_error(self, request_id, error, elapsed_time):
        """Log an API error"""
        error_time = datetime.now().isoformat()
        
        log_data = {
            "request_id": request_id,
            "timestamp": error_time,
            "elapsed_time_ms": int(elapsed_time * 1000),
            "error_type": type(error).__name__,
            "error_message": str(error)
        }
        
        self.logger.error(f"API Error: {json.dumps(log_data)}")

# Example usage
def make_api_call_with_logging(prompt, model="gpt-3.5-turbo"):
    """Make an API call with comprehensive logging"""
    api_logger = APILogger()
    messages = [{"role": "user", "content": prompt}]
    
    # Log the request
    request_id = api_logger.log_request(model, messages)
    start_time = time.time()
    
    try:
        # Make the API call
        response = client.chat.completions.create(
            model=model,
            messages=messages
        )
        
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        # Log the response
        api_logger.log_response(request_id, response, elapsed_time)
        
        return response.choices[0].message.content
    except Exception as e:
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        # Log the error
        api_logger.log_error(request_id, e, elapsed_time)
        
        # Re-raise the exception
        raise
```

### Monitoring API Usage

Implementing a dashboard for monitoring API usage can help you track costs and optimize usage:

```python
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import json

class APIUsageMonitor:
    def __init__(self, log_file="openai_api.log"):
        """Initialize the API usage monitor"""
        self.log_file = log_file
    
    def parse_logs(self, days=7):
        """Parse the log file and extract API usage data"""
        # Calculate the cutoff date
        cutoff_date = datetime.now() - timedelta(days=days)
        
        requests = []
        responses = []
        errors = []
        
        with open(self.log_file, "r") as f:
            for line in f:
                try:
                    # Parse the log line
                    parts = line.strip().split(" - ")
                    timestamp_str = parts[0]
                    log_type = parts[2]
                    log_data_str = " - ".join(parts[3:])
                    
                    # Parse the timestamp
                    timestamp = datetime.fromisoformat(timestamp_str.split(",")[0])
                    
                    # Skip entries before the cutoff date
                    if timestamp < cutoff_date:
                        continue
                    
                    # Extract the JSON data
                    if "API Request" in log_data_str:
                        data = json.loads(log_data_str.replace("API Request: ", ""))
                        requests.append(data)
                    elif "API Response" in log_data_str:
                        data = json.loads(log_data_str.replace("API Response: ", ""))
                        responses.append(data)
                    elif "API Error" in log_data_str:
                        data = json.loads(log_data_str.replace("API Error: ", ""))
                        errors.append(data)
                except Exception as e:
                    # Skip malformed log lines
                    continue
        
        return {
            "requests": requests,
            "responses": responses,
            "errors": errors
        }
    
    def generate_usage_report(self, days=7):
        """Generate a usage report for the specified number of days"""
        data = self.parse_logs(days)
        
        # Create DataFrames
        requests_df = pd.DataFrame(data["requests"])
        responses_df = pd.DataFrame(data["responses"])
        errors_df = pd.DataFrame(data["errors"])
        
        # Merge request and response data
        if not responses_df.empty and not requests_df.empty:
            merged_df = pd.merge(
                requests_df,
                responses_df,
                on="request_id",
                suffixes=("_req", "_resp")
            )
            
            # Calculate daily token usage
            merged_df["date"] = pd.to_datetime(merged_df["timestamp_req"]).dt.date
            daily_usage = merged_df.groupby("date").agg({
                "usage.total_tokens": "sum",
                "request_id": "count"
            }).rename(columns={
                "usage.total_tokens": "total_tokens",
                "request_id": "request_count"
            })
            
            # Calculate model usage
            model_usage = merged_df.groupby("model_req").agg({
                "usage.total_tokens": "sum",
                "request_id": "count"
            }).rename(columns={
                "usage.total_tokens": "total_tokens",
                "request_id": "request_count"
            })
            
            # Calculate error rate
            total_requests = len(requests_df)
            total_errors = len(errors_df)
            error_rate = total_errors / total_requests if total_requests > 0 else 0
            
            # Calculate average response time
            avg_response_time = merged_df["elapsed_time_ms"].mean() if "elapsed_time_ms" in merged_df.columns else 0
            
            # Estimate cost (approximate)
            cost_per_1k_tokens = {
                "gpt-4o": 0.01,  # $10 per 1M tokens
                "gpt-4": 0.03,   # $30 per 1M tokens
                "gpt-3.5-turbo": 0.001  # $1 per 1M tokens
            }
            
            merged_df["cost"] = merged_df.apply(
                lambda row: (row["usage.total_tokens"] / 1000) * cost_per_1k_tokens.get(row["model_req"], 0.01),
                axis=1
            )
            
            total_cost = merged_df["cost"].sum()
            
            return {
                "daily_usage": daily_usage,
                "model_usage": model_usage,
                "total_requests": total_requests,
                "total_errors": total_errors,
                "error_rate": error_rate,
                "avg_response_time": avg_response_time,
                "total_tokens": merged_df["usage.total_tokens"].sum(),
                "estimated_cost": total_cost
            }
        else:
            return {
                "error": "No data available for the specified period"
            }
    
    def plot_usage_trends(self, days=30):
        """Plot usage trends for the specified number of days"""
        report = self.generate_usage_report(days)
        
        if "error" in report:
            print(report["error"])
            return
        
        # Create a figure with subplots
        fig, axs = plt.subplots(2, 2, figsize=(15, 10))
        
        # Plot daily token usage
        report["daily_usage"]["total_tokens"].plot(
            kind="bar",
            ax=axs[0, 0],
            title="Daily Token Usage"
        )
        axs[0, 0].set_ylabel("Tokens")
        axs[0, 0].set_xlabel("Date")
        
        # Plot daily request count
        report["daily_usage"]["request_count"].plot(
            kind="bar",
            ax=axs[0, 1],
            title="Daily Request Count"
        )
        axs[0, 1].set_ylabel("Requests")
        axs[0, 1].set_xlabel("Date")
        
        # Plot model usage (tokens)
        report["model_usage"]["total_tokens"].plot(
            kind="pie",
            ax=axs[1, 0],
            title="Token Usage by Model",
            autopct="%1.1f%%"
        )
        
        # Plot model usage (requests)
        report["model_usage"]["request_count"].plot(
            kind="pie",
            ax=axs[1, 1],
            title="Request Count by Model",
            autopct="%1.1f%%"
        )
        
        # Add a title to the figure
        fig.suptitle(f"OpenAI API Usage Report (Last {days} Days)", fontsize=16)
        
        # Adjust layout
        plt.tight_layout()
        plt.subplots_adjust(top=0.9)
        
        # Save the figure
        plt.savefig("api_usage_report.png")
        
        # Print summary statistics
        print(f"Summary Statistics (Last {days} Days):")
        print(f"Total Requests: {report['total_requests']}")
        print(f"Total Tokens: {report['total_tokens']}")
        print(f"Error Rate: {report['error_rate']*100:.2f}%")
        print(f"Average Response Time: {report['avg_response_time']:.2f} ms")
        print(f"Estimated Cost: ${report['estimated_cost']:.2f}")
        
        return "api_usage_report.png"
```

## Security Best Practices

Implementing proper security measures is crucial when working with the OpenAI API.

### API Key Management

```python
import os
from dotenv import load_dotenv
import keyring

class APIKeyManager:
    def __init__(self, service_name="openai-api"):
        """Initialize the API key manager"""
        self.service_name = service_name
    
    def store_api_key(self, key, username="default"):
        """Store the API key securely"""
        keyring.set_password(self.service_name, username, key)
        print(f"API key stored securely for user '{username}'")
    
    def get_api_key(self, username="default"):
        """Retrieve the API key"""
        key = keyring.get_password(self.service_name, username)
        if not key:
            raise ValueError(f"No API key found for user '{username}'")
        return key
    
    def delete_api_key(self, username="default"):
        """Delete the stored API key"""
        keyring.delete_password(self.service_name, username)
        print(f"API key deleted for user '{username}'")

# Example usage
def setup_secure_client():
    """Set up a secure OpenAI client"""
    # Try to get the API key from environment variables first
    api_key = os.environ.get("OPENAI_API_KEY")
    
    # If not found, try to get it from the secure storage
    if not api_key:
        try:
            key_manager = APIKeyManager()
            api_key = key_manager.get_api_key()
        except Exception as e:
            print(f"Error retrieving API key: {e}")
            # Prompt the user for the API key
            api_key = input("Please enter your OpenAI API key: ")
            
            # Ask if they want to store it securely
            store_key = input("Do you want to store this key securely? (y/n): ").lower()
            if store_key == "y":
                key_manager = APIKeyManager()
                key_manager.store_api_key(api_key)
    
    # Create the client with the API key
    client = OpenAI(api_key=api_key)
    return client
```

### Request Validation

Implementing request validation can prevent security issues and improve reliability:

```python
import re
import json

class RequestValidator:
    def __init__(self):
        """Initialize the request validator"""
        # Define validation rules
        self.max_prompt_length = 4000
        self.allowed_models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]
        self.sensitive_pattern = re.compile(
            r'(password|api[_\s]?key|secret|token|credential|auth[_\s]?token)',
            re.IGNORECASE
        )
    
    def validate_prompt(self, prompt):
        """Validate a prompt for security and quality issues"""
        issues = []
        
        # Check length
        if len(prompt) > self.max_prompt_length:
            issues.append(f"Prompt exceeds maximum length of {self.max_prompt_length} characters")
        
        # Check for sensitive information
        if self.sensitive_pattern.search(prompt):
            issues.append("Prompt may contain sensitive information (passwords, API keys, etc.)")
        
        # Check for excessive special characters (potential injection)
        special_char_count = sum(1 for c in prompt if not c.isalnum() and not c.isspace())
        if special_char_count > len(prompt) * 0.3:
            issues.append("Prompt contains an unusually high number of special characters")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues
        }
    
    def validate_model(self, model):
        """Validate that the requested model is allowed"""
        if model not in self.allowed_models:
            return {
                "valid": False,
                "issues": [f"Model '{model}' is not in the list of allowed models"]
            }
        return {"valid": True, "issues": []}
    
    def validate_request(self, model, messages, temperature=None, max_tokens=None):
        """Validate a complete API request"""
        issues = []
        
        # Validate model
        model_validation = self.validate_model(model)
        if not model_validation["valid"]:
            issues.extend(model_validation["issues"])
        
        # Validate each message
        for i, message in enumerate(messages):
            if "content" in message and message["content"]:
                prompt_validation = self.validate_prompt(message["content"])
                if not prompt_validation["valid"]:
                    for issue in prompt_validation["issues"]:
                        issues.append(f"Message {i+1}: {issue}")
        
        # Validate temperature
        if temperature is not None and (temperature < 0 or temperature > 2):
            issues.append("Temperature must be between 0 and 2")
        
        # Validate max_tokens
        if max_tokens is not None and max_tokens < 1:
            issues.append("max_tokens must be at least 1")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues
        }

# Example usage
def make_validated_request(prompt, model="gpt-3.5-turbo", temperature=0.7):
    """Make a validated API request"""
    validator = RequestValidator()
    messages = [{"role": "user", "content": prompt}]
    
    # Validate the request
    validation_result = validator.validate_request(model, messages, temperature)
    
    if not validation_result["valid"]:
        print("Request validation failed:")
        for issue in validation_result["issues"]:
            print(f"- {issue}")
        return None
    
    # Make the API call
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"API request failed: {e}")
        return None
```

### Secure Proxy Implementation

For applications where clients need to access the API, implementing a secure proxy is recommended:

```python
from flask import Flask, request, jsonify
import jwt
import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "your-secret-key"  # Use a secure random key in production

# OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

# User authentication (simplified for example)
@app.route("/api/login", methods=["POST"])
def login():
    # In a real application, validate credentials against a database
    username = request.json.get("username")
    password = request.json.get("password")
    
    # Simplified authentication
    if username == "demo" and password == "password":
        # Generate JWT token
        token = jwt.encode(
            {
                "user": username,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        
        return jsonify({"token": token})
    
    return jsonify({"error": "Invalid credentials"}), 401

# Middleware to verify JWT token
def token_required(f):
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            # Remove "Bearer " prefix if present
            if token.startswith("Bearer "):
                token = token[7:]
            
            # Decode the token
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except:
            return jsonify({"error": "Invalid token"}), 401
        
        return f(*args, **kwargs)
    
    return decorated

# OpenAI API proxy endpoint
@app.route("/api/openai/chat", methods=["POST"])
@token_required
def openai_chat_proxy():
    # Get request data
    data = request.json
    
    # Validate required fields
    if "messages" not in data:
        return jsonify({"error": "Messages are required"}), 400
    
    # Set default values for optional parameters
    model = data.get("model", "gpt-3.5-turbo")
    temperature = data.get("temperature", 0.7)
    max_tokens = data.get("max_tokens", None)
    
    # Validate the request
    validator = RequestValidator()
    validation_result = validator.validate_request(
        model, data["messages"], temperature, max_tokens
    )
    
    if not validation_result["valid"]:
        return jsonify({
            "error": "Validation failed",
            "issues": validation_result["issues"]
        }), 400
    
    # Make the API call
    try:
        response = client.chat.completions.create(
            model=model,
            messages=data["messages"],
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        # Return the response
        return jsonify({
            "content": response.choices[0].message.content,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
```

In the next section, we'll explore performance optimization techniques for working with the OpenAI API.
# Performance Optimization Techniques

## Prompt Engineering for Efficiency

Effective prompt engineering can significantly improve the performance and efficiency of your OpenAI API usage.

### Designing Clear and Concise Prompts

Well-designed prompts lead to better responses while using fewer tokens:

```python
# Less efficient prompt
inefficient_prompt = """
I need you to summarize a text about climate change. The text is quite long and contains a lot of information about global warming, rising sea levels, and the impact on ecosystems. I want you to make sure you capture all the key points while keeping the summary concise. Please make sure to mention the causes of climate change, the effects, and potential solutions. The text is as follows:

[Long text about climate change...]
"""

# More efficient prompt
efficient_prompt = """
Summarize the following text about climate change, covering causes, effects, and solutions:

[Long text about climate change...]
"""

# The efficient prompt communicates the same requirements with fewer tokens
```

### Using System Messages Effectively

System messages can set the stage for the entire conversation, reducing the need for repetitive instructions:

```python
# Example of effective system message usage
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system", 
            "content": "You are a technical documentation writer. Provide concise, accurate explanations with code examples when relevant. Use markdown formatting."
        },
        {
            "role": "user", 
            "content": "Explain how to implement pagination in a REST API."
        }
    ]
)
```

### Structuring Multi-turn Conversations

For multi-turn conversations, maintain context efficiently:

```python
def efficient_conversation():
    # Initialize with a clear system message
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant that provides concise, accurate information."
        }
    ]
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() in ["exit", "quit", "bye"]:
            break
        
        # Add user message
        messages.append({"role": "user", "content": user_input})
        
        # Get response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        
        assistant_message = response.choices[0].message.content
        print(f"Assistant: {assistant_message}")
        
        # Add assistant message to history
        messages.append({"role": "assistant", "content": assistant_message})
        
        # Manage context window by summarizing or truncating when needed
        if len(messages) > 10:
            # Summarize the conversation so far
            summary_request = [
                {"role": "system", "content": "Summarize the key points of this conversation concisely."},
                {"role": "user", "content": str(messages[1:-2])}  # Exclude system message and recent exchanges
            ]
            
            summary_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=summary_request
            )
            
            summary = summary_response.choices[0].message.content
            
            # Reset the conversation with the summary
            messages = [
                messages[0],  # Keep the original system message
                {"role": "system", "content": f"Previous conversation summary: {summary}"},
                messages[-2],  # Keep the last user message
                messages[-1]   # Keep the last assistant message
            ]
```

## Token Optimization Strategies

Optimizing token usage can significantly reduce costs and improve performance.

### Token Counting and Budgeting

```python
import tiktoken

def count_tokens(text, model="gpt-4o"):
    """Count the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)
    return len(tokens)

def count_message_tokens(messages, model="gpt-4o"):
    """Count the number of tokens in a list of messages."""
    encoding = tiktoken.encoding_for_model(model)
    
    # From OpenAI's documentation on token counting
    tokens_per_message = 3  # Every message follows <im_start>{role/name}\n{content}<im_end>\n
    tokens_per_name = 1     # If there's a name, the role is omitted
    
    total_tokens = 0
    for message in messages:
        total_tokens += tokens_per_message
        for key, value in message.items():
            total_tokens += len(encoding.encode(value))
            if key == "name":
                total_tokens += tokens_per_name
    
    total_tokens += 3  # Every reply is primed with <im_start>assistant
    
    return total_tokens

def optimize_within_token_budget(messages, max_tokens=4000, model="gpt-4o"):
    """Optimize messages to fit within a token budget."""
    current_tokens = count_message_tokens(messages, model)
    
    if current_tokens <= max_tokens:
        return messages
    
    # We need to reduce the token count
    # Strategy: Keep system message, recent messages, and summarize older messages
    
    system_messages = [m for m in messages if m["role"] == "system"]
    non_system_messages = [m for m in messages if m["role"] != "system"]
    
    # If we have too many messages, summarize the older ones
    if len(non_system_messages) > 4:
        # Keep the most recent messages
        recent_messages = non_system_messages[-4:]
        older_messages = non_system_messages[:-4]
        
        # Create a summary of older messages
        older_content = "\n".join([f"{m['role']}: {m['content']}" for m in older_messages])
        
        summary_request = [
            {"role": "system", "content": "Summarize the following conversation extremely concisely:"},
            {"role": "user", "content": older_content}
        ]
        
        summary_response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Use a cheaper model for summarization
            messages=summary_request,
            max_tokens=200  # Limit the summary size
        )
        
        summary = summary_response.choices[0].message.content
        
        # Replace older messages with a summary
        optimized_messages = system_messages + [{"role": "system", "content": f"Previous conversation summary: {summary}"}] + recent_messages
        
        # Check if we're now within budget
        if count_message_tokens(optimized_messages, model) <= max_tokens:
            return optimized_messages
    
    # If we're still over budget, truncate content
    # Start with the oldest non-system messages
    optimized_messages = system_messages.copy()
    remaining_budget = max_tokens - count_message_tokens(optimized_messages, model)
    
    for message in non_system_messages:
        message_tokens = count_tokens(message["content"], model) + 4  # 4 tokens for message metadata
        
        if message_tokens <= remaining_budget:
            # Message fits within budget
            optimized_messages.append(message)
            remaining_budget -= message_tokens
        else:
            # Message needs truncation
            encoding = tiktoken.encoding_for_model(model)
            truncated_content = encoding.decode(encoding.encode(message["content"])[:remaining_budget - 5])
            truncated_message = {
                "role": message["role"],
                "content": truncated_content + "..."
            }
            optimized_messages.append(truncated_message)
            break
    
    return optimized_messages
```

### Chunking Large Documents

When working with large documents, chunking can help manage token limits:

```python
def process_large_document(document, chunk_size=2000, overlap=200):
    """Process a large document by breaking it into overlapping chunks."""
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    tokens = encoding.encode(document)
    
    results = []
    
    # Process document in chunks
    for i in range(0, len(tokens), chunk_size - overlap):
        # Get chunk with overlap
        chunk_tokens = tokens[i:i + chunk_size]
        chunk_text = encoding.decode(chunk_tokens)
        
        # Process the chunk
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are processing part of a larger document. Focus on extracting key information."},
                {"role": "user", "content": f"Process the following text (chunk {i // (chunk_size - overlap) + 1}):\n\n{chunk_text}"}
            ]
        )
        
        results.append(response.choices[0].message.content)
    
    # Combine results
    combined_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are combining information from multiple document chunks. Create a coherent synthesis."},
            {"role": "user", "content": f"Combine these document processing results into a coherent whole:\n\n{results}"}
        ]
    )
    
    return combined_response.choices[0].message.content
```

### Compression Techniques

For applications that need to maintain long conversation histories, compression can help:

```python
def compress_conversation_history(messages):
    """Compress a conversation history to reduce token usage."""
    # Extract system messages
    system_messages = [m for m in messages if m["role"] == "system"]
    
    # Get non-system messages
    conversation = [m for m in messages if m["role"] != "system"]
    
    # If conversation is short, no need to compress
    if len(conversation) <= 4:
        return messages
    
    # Prepare conversation for compression
    conversation_text = "\n\n".join([
        f"{m['role'].upper()}: {m['content']}"
        for m in conversation
    ])
    
    # Compress the conversation
    compression_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system", 
                "content": "Compress the following conversation into a minimal form that preserves all important information and context. Focus on key points, decisions, and information shared."
            },
            {"role": "user", "content": conversation_text}
        ]
    )
    
    compressed_conversation = compression_response.choices[0].message.content
    
    # Create a new message list with the compressed history
    compressed_messages = system_messages + [
        {"role": "system", "content": f"Compressed conversation history: {compressed_conversation}"},
        # Keep the most recent user message for context
        conversation[-1]
    ]
    
    return compressed_messages
```

## Parallel Processing and Batching

For applications that need to process multiple requests, parallel processing and batching can improve throughput.

### Asynchronous Processing

```python
import asyncio
from openai import AsyncOpenAI

async def process_multiple_prompts(prompts, model="gpt-3.5-turbo"):
    """Process multiple prompts in parallel using async."""
    client = AsyncOpenAI(
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    
    async def process_single_prompt(prompt):
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"
    
    # Create tasks for all prompts
    tasks = [process_single_prompt(prompt) for prompt in prompts]
    
    # Execute all tasks concurrently
    results = await asyncio.gather(*tasks)
    
    return results

# Example usage
async def main():
    prompts = [
        "Explain quantum computing in simple terms.",
        "Write a short poem about the ocean.",
        "What are the key features of Python?",
        "Describe the process of photosynthesis.",
        "What is the capital of France and some interesting facts about it?"
    ]
    
    results = await process_multiple_prompts(prompts)
    
    for i, result in enumerate(results):
        print(f"Result {i+1}:\n{result}\n")

# Run the async function
asyncio.run(main())
```

### Controlled Concurrency

To avoid rate limits, implement controlled concurrency:

```python
import asyncio
from openai import AsyncOpenAI
import time

async def process_with_controlled_concurrency(prompts, max_concurrency=5, model="gpt-3.5-turbo"):
    """Process prompts with controlled concurrency to avoid rate limits."""
    client = AsyncOpenAI(
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    
    # Semaphore to control concurrency
    semaphore = asyncio.Semaphore(max_concurrency)
    
    async def process_with_semaphore(prompt):
        async with semaphore:
            try:
                response = await client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}]
                )
                return response.choices[0].message.content
            except Exception as e:
                return f"Error: {str(e)}"
            finally:
                # Add a small delay to avoid hitting rate limits
                await asyncio.sleep(0.1)
    
    # Create tasks for all prompts
    tasks = [process_with_semaphore(prompt) for prompt in prompts]
    
    # Execute tasks with controlled concurrency
    results = await asyncio.gather(*tasks)
    
    return results
```

### Batch Processing with Progress Tracking

For large batches, implement progress tracking:

```python
import asyncio
import time
from tqdm import tqdm

async def batch_process_with_progress(prompts, batch_size=10, max_concurrency=5, model="gpt-3.5-turbo"):
    """Process a large batch of prompts with progress tracking."""
    client = AsyncOpenAI(
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    
    # Semaphore to control concurrency
    semaphore = asyncio.Semaphore(max_concurrency)
    
    # Results container
    results = [None] * len(prompts)
    
    # Progress bar
    pbar = tqdm(total=len(prompts), desc="Processing prompts")
    
    async def process_prompt(index, prompt):
        async with semaphore:
            try:
                response = await client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}]
                )
                results[index] = response.choices[0].message.content
            except Exception as e:
                results[index] = f"Error: {str(e)}"
            finally:
                pbar.update(1)
                # Add a small delay to avoid hitting rate limits
                await asyncio.sleep(0.1)
    
    # Process in batches
    for i in range(0, len(prompts), batch_size):
        batch = prompts[i:i + batch_size]
        
        # Create tasks for the current batch
        tasks = [
            process_prompt(i + j, prompt)
            for j, prompt in enumerate(batch)
        ]
        
        # Execute batch
        await asyncio.gather(*tasks)
        
        # Add a delay between batches
        if i + batch_size < len(prompts):
            await asyncio.sleep(1)
    
    pbar.close()
    return results
```

## Implementing Fallback Mechanisms

Robust applications need fallback mechanisms to handle various failure scenarios.

### Model Fallback Chain

```python
def model_fallback_chain(prompt, models=None):
    """Try multiple models in sequence until one succeeds."""
    if models is None:
        models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]
    
    last_error = None
    
    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # If successful, return the result and the model used
            return {
                "content": response.choices[0].message.content,
                "model": model,
                "success": True
            }
        except Exception as e:
            last_error = str(e)
            print(f"Error with model {model}: {last_error}")
            continue
    
    # If all models fail, return the error
    return {
        "content": None,
        "model": None,
        "success": False,
        "error": last_error
    }
```

### Content Fallback Strategies

```python
def content_fallback_strategy(prompt, max_attempts=3):
    """Try different prompt formulations if initial attempts fail."""
    # Original attempt
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as original_error:
        print(f"Original attempt failed: {str(original_error)}")
    
    # Fallback 1: Simplify the prompt
    try:
        simplified_prompt = f"Please answer this question simply: {prompt}"
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": simplified_prompt}]
        )
        return response.choices[0].message.content
    except Exception as fallback1_error:
        print(f"Simplified prompt failed: {str(fallback1_error)}")
    
    # Fallback 2: Break into smaller parts
    try:
        # This is a simplified example; in practice, you would use NLP to break the prompt
        parts = prompt.split(". ")
        results = []
        
        for part in parts:
            if part:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": part}]
                )
                results.append(response.choices[0].message.content)
        
        # Combine the results
        combined_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": f"Combine these responses into a coherent answer: {results}"}
            ]
        )
        
        return combined_response.choices[0].message.content
    except Exception as fallback2_error:
        print(f"Breaking into parts failed: {str(fallback2_error)}")
    
    # Final fallback: Return a generic response
    return "I'm sorry, I couldn't process your request at this time. Please try again later or rephrase your question."
```

### Hybrid Approaches

For critical applications, consider hybrid approaches that combine AI with traditional methods:

```python
def hybrid_question_answering(question, knowledge_base=None):
    """Hybrid approach combining retrieval and generation."""
    # Step 1: Try to find an answer in the knowledge base
    if knowledge_base:
        kb_answer = search_knowledge_base(question, knowledge_base)
        if kb_answer:
            return {
                "answer": kb_answer,
                "source": "knowledge_base",
                "confidence": "high"
            }
    
    # Step 2: Try the OpenAI API
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": question}]
        )
        
        return {
            "answer": response.choices[0].message.content,
            "source": "openai_api",
            "confidence": "medium"
        }
    except Exception as e:
        print(f"API error: {str(e)}")
    
    # Step 3: Fall back to a rule-based system
    rule_based_answer = rule_based_qa_system(question)
    if rule_based_answer:
        return {
            "answer": rule_based_answer,
            "source": "rule_based",
            "confidence": "medium"
        }
    
    # Step 4: Final fallback
    return {
        "answer": "I don't have enough information to answer that question at this time.",
        "source": "fallback",
        "confidence": "low"
    }

def search_knowledge_base(question, knowledge_base):
    """Search a knowledge base for an answer (simplified example)."""
    # In a real implementation, this would use vector search or another retrieval method
    for entry in knowledge_base:
        if question.lower() in entry["question"].lower():
            return entry["answer"]
    return None

def rule_based_qa_system(question):
    """Simple rule-based QA system as a fallback."""
    # Simplified example with a few rules
    question_lower = question.lower()
    
    if "hours" in question_lower and "open" in question_lower:
        return "Our hours of operation are Monday to Friday, 9 AM to 5 PM."
    
    if "contact" in question_lower or "support" in question_lower:
        return "You can contact our support team at support@example.com or call 1-800-555-1234."
    
    if "price" in question_lower or "cost" in question_lower:
        return "Our pricing information can be found on our website at example.com/pricing."
    
    return None
```

## Cost Optimization Strategies

Implementing cost optimization strategies can help manage your OpenAI API expenses.

### Tiered Model Selection

```python
def tiered_model_selection(prompt, complexity_threshold=0.5):
    """Select the appropriate model based on prompt complexity."""
    # Analyze prompt complexity (simplified example)
    words = prompt.split()
    avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
    sentence_count = prompt.count(".") + prompt.count("!") + prompt.count("?")
    avg_sentence_length = len(words) / sentence_count if sentence_count > 0 else len(words)
    
    # Calculate complexity score (simplified)
    complexity_score = (avg_word_length / 10) + (avg_sentence_length / 20)
    
    # Select model based on complexity
    if complexity_score > complexity_threshold:
        # More complex prompts get the more capable model
        model = "gpt-4o"
    else:
        # Simpler prompts get the more economical model
        model = "gpt-3.5-turbo"
    
    print(f"Prompt complexity: {complexity_score:.2f}, using model: {model}")
    
    # Make the API call with the selected model
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

### Usage Monitoring and Budgeting

```python
class APIBudgetManager:
    def __init__(self, daily_budget=10.0):
        """Initialize the budget manager with a daily budget in USD."""
        self.daily_budget = daily_budget
        self.usage_log = []
        self.today = datetime.datetime.now().date()
        
        # Approximate costs per 1K tokens (check OpenAI's pricing page for current rates)
        self.cost_per_1k_tokens = {
            "gpt-4o": 0.01,  # $10 per 1M tokens
            "gpt-4": 0.03,   # $30 per 1M tokens
            "gpt-3.5-turbo": 0.001  # $1 per 1M tokens
        }
    
    def log_usage(self, model, prompt_tokens, completion_tokens):
        """Log API usage."""
        # Reset if it's a new day
        current_date = datetime.datetime.now().date()
        if current_date != self.today:
            self.today = current_date
            self.usage_log = []
        
        # Calculate cost
        total_tokens = prompt_tokens + completion_tokens
        cost_per_1k = self.cost_per_1k_tokens.get(model, 0.01)  # Default to gpt-4o pricing if unknown
        cost = (total_tokens / 1000) * cost_per_1k
        
        # Log the usage
        self.usage_log.append({
            "timestamp": datetime.datetime.now().isoformat(),
            "model": model,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens,
            "cost": cost
        })
    
    def get_daily_usage(self):
        """Get the total usage for today."""
        total_tokens = sum(entry["total_tokens"] for entry in self.usage_log)
        total_cost = sum(entry["cost"] for entry in self.usage_log)
        
        return {
            "date": self.today.isoformat(),
            "total_tokens": total_tokens,
            "total_cost": total_cost,
            "budget_remaining": self.daily_budget - total_cost,
            "budget_percentage": (total_cost / self.daily_budget) * 100 if self.daily_budget > 0 else 0
        }
    
    def check_budget(self, model, estimated_tokens):
        """Check if a request would exceed the daily budget."""
        # Get current usage
        usage = self.get_daily_usage()
        
        # Estimate cost of the new request
        cost_per_1k = self.cost_per_1k_tokens.get(model, 0.01)
        estimated_cost = (estimated_tokens / 1000) * cost_per_1k
        
        # Check if it would exceed the budget
        if usage["total_cost"] + estimated_cost > self.daily_budget:
            return {
                "within_budget": False,
                "estimated_cost": estimated_cost,
                "budget_remaining": usage["budget_remaining"],
                "message": f"This request would exceed your daily budget of ${self.daily_budget:.2f}"
            }
        
        return {
            "within_budget": True,
            "estimated_cost": estimated_cost,
            "budget_remaining": usage["budget_remaining"] - estimated_cost,
            "message": f"Request is within budget. Estimated cost: ${estimated_cost:.4f}"
        }
    
    def make_budgeted_request(self, messages, model="gpt-3.5-turbo"):
        """Make an API request while respecting the budget."""
        # Estimate token usage
        estimated_tokens = count_message_tokens(messages, model) + 500  # Add buffer for completion
        
        # Check budget
        budget_check = self.check_budget(model, estimated_tokens)
        
        if not budget_check["within_budget"]:
            print(budget_check["message"])
            
            # Try with a cheaper model if available
            if model == "gpt-4o" or model == "gpt-4":
                print("Trying with gpt-3.5-turbo instead...")
                return self.make_budgeted_request(messages, "gpt-3.5-turbo")
            
            return {
                "error": "Budget exceeded",
                "message": budget_check["message"]
            }
        
        # Make the API call
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages
            )
            
            # Log the actual usage
            self.log_usage(
                model,
                response.usage.prompt_tokens,
                response.usage.completion_tokens
            )
            
            return {
                "content": response.choices[0].message.content,
                "usage": response.usage,
                "cost": (response.usage.total_tokens / 1000) * self.cost_per_1k_tokens.get(model, 0.01)
            }
        except Exception as e:
            return {
                "error": str(e),
                "message": "API request failed"
            }
```

In the next section, we'll explore practical use cases and real-world applications of the OpenAI API.
# Practical Use Cases and Applications

## Content Generation and Summarization

The OpenAI API excels at generating and transforming content for various applications.

### Automated Content Creation

```python
def generate_blog_post(topic, tone="professional", length="medium"):
    """Generate a complete blog post on a given topic."""
    # Define length parameters
    length_params = {
        "short": "approximately 500 words",
        "medium": "approximately 1000 words",
        "long": "approximately 1500-2000 words"
    }
    
    # Define tone descriptions
    tone_descriptions = {
        "professional": "formal and authoritative",
        "conversational": "friendly and approachable",
        "technical": "detailed and precise",
        "humorous": "light-hearted and entertaining"
    }
    
    # Create the prompt
    prompt = f"""
    Write a {tone_descriptions.get(tone, 'well-written')} blog post about {topic}. 
    The post should be {length_params.get(length, 'approximately 1000 words')} and include:
    
    1. An engaging introduction that hooks the reader
    2. Well-structured body paragraphs with subheadings
    3. Practical insights or actionable takeaways
    4. A conclusion that summarizes key points
    
    Format the post in Markdown.
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional content writer who specializes in creating engaging, well-researched blog posts."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content

# Example usage
blog_post = generate_blog_post(
    topic="How Artificial Intelligence is Transforming Healthcare",
    tone="conversational",
    length="medium"
)

# Save the blog post to a file
with open("ai_healthcare_blog.md", "w") as f:
    f.write(blog_post)
```

### Document Summarization

```python
def summarize_document(document, summary_type="executive"):
    """Summarize a document with different summary types."""
    # Define summary types
    summary_types = {
        "executive": "Create a concise executive summary highlighting the most important points and conclusions.",
        "bullet": "Create a bullet-point summary of the key points.",
        "detailed": "Create a detailed summary that captures all main points and supporting details.",
        "eli5": "Summarize this document as if explaining to a 10-year-old."
    }
    
    # Create the prompt
    prompt = f"""
    {summary_types.get(summary_type, summary_types["executive"])}
    
    Document:
    {document}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

### Content Transformation

```python
def transform_content(content, transformation_type):
    """Transform content from one format or style to another."""
    transformations = {
        "academic_to_blog": "Transform this academic text into an engaging blog post while preserving the key information.",
        "technical_to_simple": "Rewrite this technical content in simple, easy-to-understand language.",
        "bullet_to_narrative": "Convert these bullet points into a flowing narrative text.",
        "long_to_short": "Condense this content into a much shorter version while preserving the key points.",
        "formal_to_casual": "Rewrite this formal content in a more casual, conversational tone."
    }
    
    prompt = f"""
    {transformations.get(transformation_type, "Transform this content appropriately.")}
    
    Content:
    {content}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

## Conversational AI and Chatbots

The OpenAI API is particularly well-suited for building conversational applications.

### Building a Customer Support Chatbot

```python
import json

class CustomerSupportChatbot:
    def __init__(self, product_knowledge_base=None):
        """Initialize the customer support chatbot."""
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        self.product_knowledge_base = product_knowledge_base
        self.conversation_history = []
        self.system_message = {
            "role": "system",
            "content": """
            You are a helpful customer support assistant for our technology company.
            Be friendly, concise, and solution-oriented.
            If you don't know the answer to a question, don't make up information - instead, offer to escalate to a human agent.
            """
        }
    
    def get_product_info(self, product_query):
        """Retrieve product information from the knowledge base."""
        if not self.product_knowledge_base:
            return None
        
        # Simple keyword matching (in a real system, use vector search)
        for product in self.product_knowledge_base:
            if product_query.lower() in product["name"].lower() or any(keyword in product_query.lower() for keyword in product["keywords"]):
                return product
        
        return None
    
    def handle_message(self, user_message):
        """Process a user message and generate a response."""
        # Add the user message to the conversation history
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Check if this is a product query
        product_info = self.get_product_info(user_message)
        if product_info:
            # Add product information to the context
            product_context = f"""
            Relevant product information:
            Name: {product_info['name']}
            Description: {product_info['description']}
            Price: {product_info['price']}
            Features: {', '.join(product_info['features'])}
            """
            
            self.conversation_history.append({"role": "system", "content": product_context})
        
        # Prepare the messages for the API call
        messages = [self.system_message] + self.conversation_history
        
        # Make the API call
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using a cost-effective model for customer support
            messages=messages
        )
        
        # Extract the assistant's response
        assistant_response = response.choices[0].message.content
        
        # Add the response to the conversation history
        self.conversation_history.append({"role": "assistant", "content": assistant_response})
        
        # Manage conversation history length
        if len(self.conversation_history) > 10:
            # Keep only the most recent messages
            self.conversation_history = self.conversation_history[-10:]
        
        return assistant_response

# Example product knowledge base
product_kb = [
    {
        "name": "TechPro Laptop X1",
        "description": "A high-performance laptop for professionals",
        "price": "$1,299",
        "features": ["14-inch 4K display", "16GB RAM", "512GB SSD", "Intel Core i7", "12-hour battery life"],
        "keywords": ["laptop", "computer", "techpro", "x1"]
    },
    {
        "name": "SmartHome Hub",
        "description": "Central control for all your smart home devices",
        "price": "$199",
        "features": ["Voice control", "Compatible with 100+ devices", "Energy monitoring", "Automated routines"],
        "keywords": ["smart home", "hub", "automation", "iot"]
    }
]

# Initialize the chatbot
chatbot = CustomerSupportChatbot(product_kb)

# Example conversation
print("Customer Support Bot: Hello! How can I help you today?")

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Customer Support Bot: Thank you for contacting us. Have a great day!")
        break
    
    response = chatbot.handle_message(user_input)
    print(f"Customer Support Bot: {response}")
```

### Multi-turn Conversation Management

```python
class ConversationManager:
    def __init__(self, persona="assistant"):
        """Initialize the conversation manager with a specific persona."""
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        self.conversation_history = []
        self.personas = {
            "assistant": "You are a helpful, friendly assistant.",
            "tutor": "You are a patient, knowledgeable tutor who helps explain concepts clearly.",
            "therapist": "You are an empathetic listener who helps people process their thoughts and feelings.",
            "coach": "You are a motivational coach who helps people set and achieve goals."
        }
        self.system_message = {
            "role": "system",
            "content": self.personas.get(persona, self.personas["assistant"])
        }
    
    def add_context(self, context):
        """Add additional context to the conversation."""
        context_message = {
            "role": "system",
            "content": context
        }
        self.conversation_history.append(context_message)
    
    def process_message(self, user_message):
        """Process a user message and generate a response."""
        # Add the user message to the conversation history
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Prepare the messages for the API call
        messages = [self.system_message] + self.conversation_history
        
        # Make the API call
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        
        # Extract the assistant's response
        assistant_response = response.choices[0].message.content
        
        # Add the response to the conversation history
        self.conversation_history.append({"role": "assistant", "content": assistant_response})
        
        return assistant_response
    
    def summarize_conversation(self):
        """Generate a summary of the conversation so far."""
        if len(self.conversation_history) < 2:
            return "The conversation has just started."
        
        summary_request = [
            {"role": "system", "content": "Summarize the key points of this conversation concisely."},
            {"role": "user", "content": str(self.conversation_history)}
        ]
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=summary_request
        )
        
        return response.choices[0].message.content
    
    def save_conversation(self, filename="conversation.json"):
        """Save the conversation history to a file."""
        with open(filename, "w") as f:
            json.dump({
                "system_message": self.system_message,
                "conversation": self.conversation_history
            }, f, indent=2)
        
        return f"Conversation saved to {filename}"
    
    def load_conversation(self, filename="conversation.json"):
        """Load a conversation history from a file."""
        try:
            with open(filename, "r") as f:
                data = json.load(f)
                self.system_message = data["system_message"]
                self.conversation_history = data["conversation"]
            
            return f"Conversation loaded from {filename}"
        except Exception as e:
            return f"Error loading conversation: {str(e)}"
```

## Data Analysis and Processing

The OpenAI API can be used for various data analysis and processing tasks.

### Text Classification and Categorization

```python
def classify_text(text, categories):
    """Classify text into one of the provided categories."""
    categories_str = ", ".join(categories)
    
    prompt = f"""
    Classify the following text into exactly one of these categories: {categories_str}
    
    Text: {text}
    
    Category:
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3  # Lower temperature for more deterministic results
    )
    
    return response.choices[0].message.content.strip()

def batch_classify_texts(texts, categories):
    """Classify multiple texts in batch."""
    results = []
    
    for text in texts:
        category = classify_text(text, categories)
        results.append({
            "text": text,
            "category": category
        })
    
    return results

# Example usage
customer_feedback = [
    "The product was amazing and exceeded my expectations!",
    "I've been waiting for a refund for two weeks now.",
    "How do I reset my password?",
    "The checkout process was confusing and I couldn't complete my order."
]

categories = ["Positive Feedback", "Complaint", "Question", "Bug Report"]

classification_results = batch_classify_texts(customer_feedback, categories)

for result in classification_results:
    print(f"Text: {result['text']}")
    print(f"Category: {result['category']}")
    print()
```

### Named Entity Recognition

```python
def extract_entities(text, entity_types=None):
    """Extract named entities from text."""
    if entity_types is None:
        entity_types = ["Person", "Organization", "Location", "Date", "Product"]
    
    entity_types_str = ", ".join(entity_types)
    
    prompt = f"""
    Extract all {entity_types_str} entities from the following text.
    Format the output as a JSON object with entity types as keys and lists of extracted entities as values.
    
    Text: {text}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Extract the JSON from the response
    result = response.choices[0].message.content
    
    # Find JSON in the response
    import re
    json_match = re.search(r'```json\n(.*?)\n```', result, re.DOTALL)
    if json_match:
        result = json_match.group(1)
    
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        # If JSON parsing fails, return the raw text
        return {"error": "Failed to parse JSON", "raw_result": result}
```

### Sentiment Analysis

```python
def analyze_sentiment(text, detailed=False):
    """Analyze the sentiment of a text."""
    if detailed:
        prompt = f"""
        Perform a detailed sentiment analysis of the following text.
        Include:
        1. Overall sentiment (positive, negative, or neutral)
        2. Sentiment score (-1 to 1, where -1 is very negative and 1 is very positive)
        3. Key emotional tones detected
        4. Specific positive and negative aspects mentioned
        
        Format the output as JSON.
        
        Text: {text}
        """
    else:
        prompt = f"""
        Analyze the sentiment of the following text as positive, negative, or neutral.
        Include a score from -1 to 1, where -1 is very negative and 1 is very positive.
        
        Text: {text}
        
        Format the output as JSON with "sentiment" and "score" fields.
        """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result = response.choices[0].message.content
    
    # Find JSON in the response
    import re
    json_match = re.search(r'```json\n(.*?)\n```', result, re.DOTALL)
    if json_match:
        result = json_match.group(1)
    
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        # If JSON parsing fails, return the raw text
        return {"error": "Failed to parse JSON", "raw_result": result}

def batch_sentiment_analysis(texts):
    """Analyze sentiment for multiple texts in batch."""
    results = []
    
    for text in texts:
        sentiment = analyze_sentiment(text)
        results.append({
            "text": text,
            "sentiment": sentiment
        })
    
    return results
```

## Educational Applications

The OpenAI API can be used to create powerful educational tools and resources.

### Automated Tutoring System

```python
class TutoringSystem:
    def __init__(self, subject="general"):
        """Initialize the tutoring system for a specific subject."""
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        self.conversation_history = []
        
        # Define subject-specific system messages
        self.subjects = {
            "math": "You are a patient and helpful math tutor. Explain concepts step by step, provide examples, and guide students to the answer rather than giving it directly.",
            "science": "You are a knowledgeable science tutor. Explain scientific concepts clearly, relate them to real-world examples, and correct misconceptions gently.",
            "programming": "You are a programming tutor. Explain coding concepts clearly, provide code examples, and help debug issues by guiding students through the troubleshooting process.",
            "history": "You are a history tutor. Provide accurate historical information, explain cause and effect relationships, and help students understand different perspectives on historical events.",
            "general": "You are a helpful tutor. Explain concepts clearly, provide examples, and guide students to deeper understanding through thoughtful questions."
        }
        
        self.system_message = {
            "role": "system",
            "content": self.subjects.get(subject, self.subjects["general"])
        }
    
    def ask_question(self, question):
        """Ask a question to the tutoring system."""
        # Add the question to the conversation history
        self.conversation_history.append({"role": "user", "content": question})
        
        # Prepare the messages for the API call
        messages = [self.system_message] + self.conversation_history
        
        # Make the API call
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        
        # Extract the tutor's response
        tutor_response = response.choices[0].message.content
        
        # Add the response to the conversation history
        self.conversation_history.append({"role": "assistant", "content": tutor_response})
        
        return tutor_response
    
    def generate_practice_problems(self, topic, difficulty="medium", number=3):
        """Generate practice problems on a specific topic."""
        difficulties = {
            "easy": "basic, introductory level",
            "medium": "intermediate level with some complexity",
            "hard": "challenging, requiring deep understanding"
        }
        
        difficulty_desc = difficulties.get(difficulty, difficulties["medium"])
        
        prompt = f"""
        Generate {number} {difficulty_desc} practice problems about {topic}.
        For each problem:
        1. Provide a clear problem statement
        2. Include the correct answer
        3. Provide a step-by-step solution
        
        Format each problem with clear separation between the problem, answer, and solution.
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": self.system_message["content"]},
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content
    
    def explain_concept(self, concept, detail_level="medium"):
        """Provide an explanation of a concept at the specified detail level."""
        detail_levels = {
            "basic": "simple terms a beginner would understand",
            "medium": "moderate detail appropriate for someone with some background knowledge",
            "advanced": "in-depth detail for someone with substantial background knowledge"
        }
        
        detail_desc = detail_levels.get(detail_level, detail_levels["medium"])
        
        prompt = f"""
        Explain the concept of {concept} in {detail_desc}.
        Include:
        1. A clear definition
        2. Key principles or components
        3. Real-world examples or applications
        4. Common misconceptions, if any
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": self.system_message["content"]},
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content
```

### Quiz and Assessment Generation

```python
def generate_quiz(topic, num_questions=5, question_types=None):
    """Generate a quiz on a specific topic."""
    if question_types is None:
        question_types = ["multiple_choice", "true_false", "short_answer"]
    
    question_types_str = ", ".join(question_types)
    
    prompt = f"""
    Create a quiz about {topic} with {num_questions} questions.
    Include a mix of {question_types_str} questions.
    
    For each question:
    1. Provide a clear question
    2. For multiple choice, provide 4 options labeled A, B, C, D
    3. Include the correct answer
    4. Add a brief explanation of why the answer is correct
    
    Format the output as a JSON object with an array of question objects.
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result = response.choices[0].message.content
    
    # Find JSON in the response
    import re
    json_match = re.search(r'```json\n(.*?)\n```', result, re.DOTALL)
    if json_match:
        result = json_match.group(1)
    
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        # If JSON parsing fails, return the raw text
        return {"error": "Failed to parse JSON", "raw_result": result}

def format_quiz_for_display(quiz_data):
    """Format quiz data for display."""
    if "error" in quiz_data:
        return f"Error: {quiz_data['error']}\n\n{quiz_data['raw_result']}"
    
    formatted_quiz = "# Quiz\n\n"
    
    for i, question in enumerate(quiz_data["questions"]):
        formatted_quiz += f"## Question {i+1}: {question['question']}\n\n"
        
        if "options" in question:
            for option_key, option_value in question["options"].items():
                formatted_quiz += f"{option_key}. {option_value}\n"
            formatted_quiz += "\n"
        
        formatted_quiz += f"**Correct Answer:** {question['correct_answer']}\n\n"
        formatted_quiz += f"**Explanation:** {question['explanation']}\n\n"
        formatted_quiz += "---\n\n"
    
    return formatted_quiz
```

## Creative Applications

The OpenAI API can be used for various creative applications.

### Story Generation

```python
def generate_story(prompt, genre=None, length="medium", style=None):
    """Generate a creative story based on a prompt."""
    # Define length parameters
    length_params = {
        "short": "approximately 500 words",
        "medium": "approximately 1000 words",
        "long": "approximately 2000 words"
    }
    
    # Create the system message
    system_content = "You are a creative storyteller who writes engaging, imaginative stories."
    
    if genre:
        system_content += f" You specialize in {genre} stories."
    
    if style:
        system_content += f" Your writing style is {style}."
    
    # Create the user prompt
    user_prompt = f"""
    Write a {length_params.get(length, 'medium-length')} story based on the following prompt:
    
    {prompt}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_prompt}
        ]
    )
    
    return response.choices[0].message.content

# Example usage
story = generate_story(
    prompt="A scientist discovers a way to communicate with plants and learns they have been watching us all along.",
    genre="science fiction",
    length="short",
    style="suspenseful with a touch of humor"
)

# Save the story to a file
with open("plant_communication_story.md", "w") as f:
    f.write(story)
```

### Art and Image Prompt Generation

```python
def generate_image_prompts(concept, num_prompts=3, style=None):
    """Generate detailed prompts for image generation based on a concept."""
    styles_desc = f"in {style} style" if style else "in various artistic styles"
    
    prompt = f"""
    Create {num_prompts} detailed image generation prompts based on the concept: "{concept}"
    
    Each prompt should:
    1. Be highly descriptive and visual
    2. Include details about composition, lighting, mood, and colors
    3. Be {styles_desc}
    4. Be optimized for text-to-image AI systems
    
    Format each prompt separately and make each one unique and creative.
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content

# Example usage
image_prompts = generate_image_prompts(
    concept="A futuristic city where nature and technology have merged harmoniously",
    num_prompts=5,
    style="cyberpunk meets solarpunk"
)

print(image_prompts)
```

## Business Applications

The OpenAI API can be used for various business applications to improve efficiency and decision-making.

### Automated Email Response System

```python
def categorize_email(email_body):
    """Categorize an email into predefined categories."""
    categories = [
        "Customer Support",
        "Sales Inquiry",
        "Partnership Opportunity",
        "Job Application",
        "Feedback",
        "Complaint",
        "Other"
    ]
    
    prompt = f"""
    Categorize the following email into one of these categories: {', '.join(categories)}
    
    Email:
    {email_body}
    
    Category:
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    return response.choices[0].message.content.strip()

def generate_email_response(email_body, sender_name, company_name):
    """Generate an appropriate response to an email."""
    # First, categorize the email
    category = categorize_email(email_body)
    
    # Define response templates based on category
    templates = {
        "Customer Support": "You are a helpful customer support representative. Address the customer's issue professionally and provide a solution or next steps.",
        "Sales Inquiry": "You are a sales representative. Be helpful and informative about our products/services without being pushy.",
        "Partnership Opportunity": "You are a business development manager. Express interest in potential partnerships while requesting more specific information.",
        "Job Application": "You are an HR representative. Acknowledge receipt of the application and explain the next steps in the hiring process.",
        "Feedback": "You are a customer experience manager. Thank the sender for their feedback and explain how it will be used to improve.",
        "Complaint": "You are a customer relations specialist. Apologize for the inconvenience, show empathy, and offer a solution or escalation path.",
        "Other": "You are a helpful company representative. Respond appropriately to the email content."
    }
    
    system_content = templates.get(category, templates["Other"])
    
    prompt = f"""
    Write a professional email response to the following email from {sender_name}.
    
    Original Email:
    {email_body}
    
    Sign the email as "Customer Relations Team, {company_name}"
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": prompt}
        ]
    )
    
    return {
        "category": category,
        "response": response.choices[0].message.content
    }
```

### Meeting Summarization

```python
def summarize_meeting(transcript, format_type="detailed"):
    """Summarize a meeting transcript."""
    formats = {
        "brief": "Create a brief summary (2-3 paragraphs) of the key points discussed in the meeting.",
        "detailed": "Create a detailed summary of the meeting including all main topics, decisions, and action items.",
        "action_items": "Extract only the action items from the meeting, including who is responsible and deadlines if mentioned.",
        "decisions": "Extract only the decisions made during the meeting."
    }
    
    format_instruction = formats.get(format_type, formats["detailed"])
    
    prompt = f"""
    {format_instruction}
    
    Meeting Transcript:
    {transcript}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content

def format_meeting_summary_for_email(summary, meeting_title, meeting_date):
    """Format a meeting summary for email distribution."""
    prompt = f"""
    Format the following meeting summary as a professional email to send to meeting participants.
    Include a clear subject line, greeting, the summary content, and a professional closing.
    
    Meeting Title: {meeting_title}
    Meeting Date: {meeting_date}
    
    Summary:
    {summary}
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

## Integrating with Other Technologies

The OpenAI API can be integrated with various other technologies to create powerful applications.

### Integration with Database Systems

```python
import sqlite3

class AIDataAnalyst:
    def __init__(self, database_path):
        """Initialize the AI data analyst with a database connection."""
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        self.conn = sqlite3.connect(database_path)
        self.cursor = self.conn.cursor()
        
        # Get database schema
        self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = self.cursor.fetchall()
        
        self.schema = {}
        for table in tables:
            table_name = table[0]
            self.cursor.execute(f"PRAGMA table_info({table_name});")
            columns = self.cursor.fetchall()
            self.schema[table_name] = [column[1] for column in columns]
    
    def generate_sql_query(self, question):
        """Generate an SQL query based on a natural language question."""
        schema_str = ""
        for table, columns in self.schema.items():
            schema_str += f"Table: {table}\n"
            schema_str += f"Columns: {', '.join(columns)}\n\n"
        
        prompt = f"""
        Based on the following database schema, write an SQL query to answer the question.
        
        Database Schema:
        {schema_str}
        
        Question: {question}
        
        SQL Query:
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract the SQL query from the response
        sql_query = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        import re
        sql_match = re.search(r'```sql\n(.*?)\n```', sql_query, re.DOTALL)
        if sql_match:
            sql_query = sql_match.group(1)
        
        return sql_query
    
    def execute_query(self, sql_query):
        """Execute an SQL query and return the results."""
        try:
            self.cursor.execute(sql_query)
            columns = [description[0] for description in self.cursor.description]
            results = self.cursor.fetchall()
            
            return {
                "columns": columns,
                "results": results
            }
        except Exception as e:
            return {
                "error": str(e)
            }
    
    def analyze_data(self, question):
        """Answer a question about the data by generating and executing an SQL query."""
        # Generate the SQL query
        sql_query = self.generate_sql_query(question)
        
        # Execute the query
        query_results = self.execute_query(sql_query)
        
        if "error" in query_results:
            return {
                "question": question,
                "sql_query": sql_query,
                "error": query_results["error"]
            }
        
        # Format the results
        formatted_results = []
        for row in query_results["results"]:
            formatted_row = {}
            for i, column in enumerate(query_results["columns"]):
                formatted_row[column] = row[i]
            formatted_results.append(formatted_row)
        
        # Generate analysis of the results
        analysis_prompt = f"""
        Analyze the following data to answer the question: "{question}"
        
        SQL Query:
        {sql_query}
        
        Query Results:
        {formatted_results}
        
        Provide a clear, concise analysis of what the data shows in relation to the question.
        """
        
        analysis_response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": analysis_prompt}]
        )
        
        return {
            "question": question,
            "sql_query": sql_query,
            "results": formatted_results,
            "analysis": analysis_response.choices[0].message.content
        }
```

### Integration with Web Applications

```python
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get('text', '')
    analysis_type = data.get('analysis_type', 'sentiment')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    
    if analysis_type == 'sentiment':
        prompt = f"Perform sentiment analysis on the following text. Return a JSON object with 'sentiment' (positive, negative, or neutral) and 'score' (-1 to 1) fields.\n\nText: {text}"
    elif analysis_type == 'summary':
        prompt = f"Summarize the following text in a concise paragraph.\n\nText: {text}"
    elif analysis_type == 'keywords':
        prompt = f"Extract the top 5 keywords or key phrases from the following text. Return them as a JSON array.\n\nText: {text}"
    else:
        return jsonify({"error": "Invalid analysis type"}), 400
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        
        result = response.choices[0].message.content
        
        # For sentiment and keywords, try to parse JSON
        if analysis_type in ['sentiment', 'keywords']:
            try:
                import re
                import json
                
                # Try to extract JSON if it's in a code block
                json_match = re.search(r'```json\n(.*?)\n```', result, re.DOTALL)
                if json_match:
                    result = json_match.group(1)
                
                # Parse the JSON
                result = json.loads(result)
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw text
                result = {"result": result}
        else:
            result = {"result": result}
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

In the next section, we'll explore pricing and cost management strategies for the OpenAI API.
# Pricing and Cost Management

## Understanding OpenAI API Pricing

The OpenAI API uses a pay-as-you-go pricing model based on token usage. Understanding this pricing structure is essential for managing costs effectively.

### Token-Based Pricing Model

OpenAI's pricing is based on tokens, which are the basic units of text that the models process:

1. **Input Tokens**: Text sent to the model (your prompts)
2. **Output Tokens**: Text generated by the model (the responses)
3. **Total Tokens**: The sum of input and output tokens

Pricing varies by model, with more capable models costing more per token:

| Model | Input Price (per 1M tokens) | Output Price (per 1M tokens) |
|-------|-----------------------------|-----------------------------|
| GPT-4o | $10 | $30 |
| GPT-4 | $30 | $60 |
| GPT-3.5 Turbo | $1 | $2 |
| Text Embedding Models | $0.10 - $1.00 | N/A |

### Calculating Costs

To estimate costs for your application, you need to:

1. Estimate the number of tokens in your inputs and outputs
2. Multiply by the per-token cost for your chosen model
3. Factor in your expected usage volume

Here's a simple Python function to estimate costs:

```python
def estimate_api_cost(
    input_tokens_per_request,
    output_tokens_per_request,
    requests_per_day,
    model="gpt-3.5-turbo",
    days=30
):
    """Estimate monthly OpenAI API costs based on usage patterns."""
    # Model pricing (per 1M tokens as of 2025)
    pricing = {
        "gpt-4o": {"input": 10.0, "output": 30.0},
        "gpt-4": {"input": 30.0, "output": 60.0},
        "gpt-3.5-turbo": {"input": 1.0, "output": 2.0},
        "text-embedding-3-small": {"input": 0.1, "output": 0.0},
        "text-embedding-3-large": {"input": 1.0, "output": 0.0}
    }
    
    if model not in pricing:
        raise ValueError(f"Unknown model: {model}")
    
    # Calculate daily token usage
    daily_input_tokens = input_tokens_per_request * requests_per_day
    daily_output_tokens = output_tokens_per_request * requests_per_day
    
    # Calculate monthly token usage
    monthly_input_tokens = daily_input_tokens * days
    monthly_output_tokens = daily_output_tokens * days
    
    # Calculate costs
    input_cost = (monthly_input_tokens / 1_000_000) * pricing[model]["input"]
    output_cost = (monthly_output_tokens / 1_000_000) * pricing[model]["output"]
    total_cost = input_cost + output_cost
    
    return {
        "model": model,
        "monthly_input_tokens": monthly_input_tokens,
        "monthly_output_tokens": monthly_output_tokens,
        "monthly_total_tokens": monthly_input_tokens + monthly_output_tokens,
        "input_cost": input_cost,
        "output_cost": output_cost,
        "total_cost": total_cost
    }

# Example usage
cost_estimate = estimate_api_cost(
    input_tokens_per_request=200,
    output_tokens_per_request=800,
    requests_per_day=1000,
    model="gpt-3.5-turbo",
    days=30
)

print(f"Estimated monthly cost: ${cost_estimate['total_cost']:.2f}")
print(f"Input cost: ${cost_estimate['input_cost']:.2f}")
print(f"Output cost: ${cost_estimate['output_cost']:.2f}")
print(f"Total tokens: {cost_estimate['monthly_total_tokens']:,}")
```

## Cost Optimization Strategies

Implementing cost optimization strategies can help you manage your OpenAI API expenses effectively.

### Model Selection Optimization

Choosing the right model for each task can significantly impact costs:

```python
def select_optimal_model(task_type, complexity, budget_sensitivity):
    """Select the optimal model based on task requirements and budget constraints."""
    # Define task types and their minimum required capabilities
    task_requirements = {
        "simple_generation": {"min_capability": "basic"},
        "complex_reasoning": {"min_capability": "advanced"},
        "creative_writing": {"min_capability": "intermediate"},
        "code_generation": {"min_capability": "advanced"},
        "summarization": {"min_capability": "basic"},
        "classification": {"min_capability": "basic"},
        "embeddings": {"min_capability": "embeddings"}
    }
    
    # Define model capabilities
    model_capabilities = {
        "gpt-4o": {"capability": "advanced", "cost": "high"},
        "gpt-4": {"capability": "advanced", "cost": "very_high"},
        "gpt-3.5-turbo": {"capability": "intermediate", "cost": "low"},
        "text-embedding-3-large": {"capability": "embeddings", "cost": "medium"},
        "text-embedding-3-small": {"capability": "embeddings", "cost": "very_low"}
    }
    
    # Get the minimum required capability for the task
    if task_type not in task_requirements:
        raise ValueError(f"Unknown task type: {task_type}")
    
    min_capability = task_requirements[task_type]["min_capability"]
    
    # Filter models by minimum capability
    suitable_models = []
    for model, attributes in model_capabilities.items():
        if min_capability == "embeddings" and attributes["capability"] == "embeddings":
            suitable_models.append(model)
        elif min_capability == "advanced" and attributes["capability"] == "advanced":
            suitable_models.append(model)
        elif min_capability == "intermediate" and attributes["capability"] in ["intermediate", "advanced"]:
            suitable_models.append(model)
        elif min_capability == "basic" and attributes["capability"] in ["basic", "intermediate", "advanced"]:
            suitable_models.append(model)
    
    # Adjust based on complexity
    if complexity == "high" and "gpt-4o" in suitable_models:
        suitable_models = [model for model in suitable_models if model in ["gpt-4o", "gpt-4"]]
    elif complexity == "low" and "gpt-3.5-turbo" in suitable_models:
        suitable_models = ["gpt-3.5-turbo"]
    
    # Adjust based on budget sensitivity
    if budget_sensitivity == "high":
        # Sort by cost (ascending)
        cost_ranking = {"very_low": 1, "low": 2, "medium": 3, "high": 4, "very_high": 5}
        suitable_models.sort(key=lambda model: cost_ranking[model_capabilities[model]["cost"]])
        return suitable_models[0]  # Return the cheapest suitable model
    else:
        # For low budget sensitivity, prefer capability over cost
        capability_ranking = {"basic": 1, "intermediate": 2, "advanced": 3, "embeddings": 1}
        suitable_models.sort(key=lambda model: -capability_ranking[model_capabilities[model]["capability"]])
        return suitable_models[0]  # Return the most capable suitable model

# Example usage
recommended_model = select_optimal_model(
    task_type="summarization",
    complexity="low",
    budget_sensitivity="high"
)

print(f"Recommended model: {recommended_model}")
```

### Prompt Engineering for Cost Efficiency

Optimizing your prompts can reduce token usage and costs:

```python
def optimize_prompt_for_cost(original_prompt, model="gpt-3.5-turbo"):
    """Optimize a prompt to reduce token usage while maintaining effectiveness."""
    # Calculate original token count
    original_token_count = count_tokens(original_prompt, model)
    
    # Create a system message that instructs the model to optimize the prompt
    system_message = """
    You are a prompt optimization assistant. Your task is to rewrite prompts to be more token-efficient while maintaining their effectiveness.
    
    Guidelines for optimization:
    1. Remove unnecessary words and phrases
    2. Use concise language
    3. Maintain all key instructions and context
    4. Preserve the original intent and requirements
    5. Ensure the optimized prompt will produce the same quality of response
    """
    
    # Create the optimization request
    optimization_prompt = f"""
    Original prompt ({original_token_count} tokens):
    {original_prompt}
    
    Please optimize this prompt to use fewer tokens while maintaining its effectiveness.
    """
    
    # Get the optimized prompt
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # Using a cheaper model for optimization
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": optimization_prompt}
        ]
    )
    
    optimized_prompt = response.choices[0].message.content
    
    # Clean up the response to extract just the optimized prompt
    import re
    clean_prompt_match = re.search(r'Optimized prompt:(.*?)(?:\n\n|$)', optimized_prompt, re.DOTALL)
    if clean_prompt_match:
        optimized_prompt = clean_prompt_match.group(1).strip()
    
    # Calculate new token count
    optimized_token_count = count_tokens(optimized_prompt, model)
    
    return {
        "original_prompt": original_prompt,
        "optimized_prompt": optimized_prompt,
        "original_token_count": original_token_count,
        "optimized_token_count": optimized_token_count,
        "token_reduction": original_token_count - optimized_token_count,
        "reduction_percentage": ((original_token_count - optimized_token_count) / original_token_count) * 100 if original_token_count > 0 else 0
    }
```

### Caching Strategies

Implementing caching can significantly reduce API calls for repeated or similar requests:

```python
import hashlib
import json
import os
import time

class SimpleFileCache:
    def __init__(self, cache_dir="./cache", expire_time=86400):
        """Initialize a simple file-based cache."""
        self.cache_dir = cache_dir
        self.expire_time = expire_time  # Cache expiration in seconds (default: 24 hours)
        
        # Create cache directory if it doesn't exist
        os.makedirs(cache_dir, exist_ok=True)
    
    def _generate_cache_key(self, model, messages, temperature=None):
        """Generate a unique cache key based on request parameters."""
        # Create a dictionary of the parameters that affect the response
        cache_dict = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }
        
        # Convert to a stable string representation and hash it
        cache_str = json.dumps(cache_dict, sort_keys=True)
        return hashlib.md5(cache_str.encode()).hexdigest()
    
    def _get_cache_path(self, cache_key):
        """Get the file path for a cache key."""
        return os.path.join(self.cache_dir, f"{cache_key}.json")
    
    def get_cached_response(self, model, messages, temperature=None):
        """Get a cached response if available and not expired."""
        cache_key = self._generate_cache_key(model, messages, temperature)
        cache_path = self._get_cache_path(cache_key)
        
        if os.path.exists(cache_path):
            # Check if cache is expired
            if time.time() - os.path.getmtime(cache_path) > self.expire_time:
                # Cache is expired, remove it
                os.remove(cache_path)
                return None
            
            # Cache is valid, return it
            with open(cache_path, "r") as f:
                return json.load(f)
        
        return None
    
    def cache_response(self, model, messages, response, temperature=None):
        """Cache a response."""
        cache_key = self._generate_cache_key(model, messages, temperature)
        cache_path = self._get_cache_path(cache_key)
        
        # Convert response to a serializable format
        if hasattr(response, "model_dump"):
            response_data = response.model_dump()
        else:
            # For older versions of the API
            response_data = {
                "choices": [{"message": {"content": response.choices[0].message.content}}],
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        
        # Save to cache file
        with open(cache_path, "w") as f:
            json.dump(response_data, f)

def get_completion_with_cache(prompt, cache, model="gpt-3.5-turbo", temperature=0.7):
    """Get a completion with caching to reduce API calls."""
    messages = [{"role": "user", "content": prompt}]
    
    # Check cache first
    cached_response = cache.get_cached_response(model, messages, temperature)
    if cached_response:
        print("Using cached response")
        return cached_response["choices"][0]["message"]["content"]
    
    # If not in cache, make API call
    print("Making API call")
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature
    )
    
    # Cache the response
    cache.cache_response(model, messages, response, temperature)
    
    return response.choices[0].message.content
```

### Batch Processing

Processing requests in batches can optimize token usage and reduce costs:

```python
def batch_process_texts(texts, processor_function, batch_size=10, delay_between_batches=1):
    """Process a large number of texts in batches to manage API usage."""
    results = []
    
    # Process texts in batches
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        batch_results = []
        
        print(f"Processing batch {i//batch_size + 1}/{(len(texts) + batch_size - 1)//batch_size}")
        
        # Process each text in the batch
        for text in batch:
            result = processor_function(text)
            batch_results.append(result)
        
        results.extend(batch_results)
        
        # Delay between batches to avoid rate limits
        if i + batch_size < len(texts):
            print(f"Waiting {delay_between_batches} seconds before next batch...")
            time.sleep(delay_between_batches)
    
    return results

# Example usage
def summarize_text(text):
    """Summarize a text using the OpenAI API."""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Summarize the following text in one paragraph."},
            {"role": "user", "content": text}
        ]
    )
    
    return {
        "original_text": text,
        "summary": response.choices[0].message.content
    }

# Process a list of texts in batches
articles = [
    "Long article text 1...",
    "Long article text 2...",
    # ... more articles
]

summaries = batch_process_texts(
    texts=articles,
    processor_function=summarize_text,
    batch_size=5,
    delay_between_batches=2
)
```

## Monitoring and Budgeting

Implementing robust monitoring and budgeting systems is essential for managing API costs.

### Usage Tracking System

```python
import csv
import datetime
import os

class APIUsageTracker:
    def __init__(self, log_file="api_usage_log.csv"):
        """Initialize the API usage tracker."""
        self.log_file = log_file
        
        # Create log file with headers if it doesn't exist
        if not os.path.exists(log_file):
            with open(log_file, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "timestamp", "model", "prompt_tokens", "completion_tokens", 
                    "total_tokens", "estimated_cost", "request_id", "endpoint"
                ])
    
    def log_usage(self, model, prompt_tokens, completion_tokens, endpoint="chat.completions", request_id=None):
        """Log API usage to the CSV file."""
        # Calculate total tokens
        total_tokens = prompt_tokens + completion_tokens
        
        # Calculate estimated cost
        cost_per_1k_tokens = {
            "gpt-4o": {"input": 0.01, "output": 0.03},
            "gpt-4": {"input": 0.03, "output": 0.06},
            "gpt-3.5-turbo": {"input": 0.001, "output": 0.002},
            "text-embedding-3-small": {"input": 0.0001, "output": 0},
            "text-embedding-3-large": {"input": 0.001, "output": 0}
        }
        
        model_costs = cost_per_1k_tokens.get(model, {"input": 0.01, "output": 0.03})
        input_cost = (prompt_tokens / 1000) * model_costs["input"]
        output_cost = (completion_tokens / 1000) * model_costs["output"]
        estimated_cost = input_cost + output_cost
        
        # Generate request ID if not provided
        if request_id is None:
            request_id = f"req_{int(time.time())}_{os.urandom(4).hex()}"
        
        # Log to CSV
        with open(self.log_file, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.datetime.now().isoformat(),
                model,
                prompt_tokens,
                completion_tokens,
                total_tokens,
                estimated_cost,
                request_id,
                endpoint
            ])
        
        return {
            "request_id": request_id,
            "estimated_cost": estimated_cost,
            "total_tokens": total_tokens
        }
    
    def get_usage_summary(self, days=30):
        """Get a summary of API usage for the specified number of days."""
        # Calculate the cutoff date
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        cutoff_date_str = cutoff_date.isoformat()
        
        # Initialize summary data
        summary = {
            "total_requests": 0,
            "total_tokens": 0,
            "total_cost": 0,
            "model_usage": {},
            "daily_usage": {},
            "endpoint_usage": {}
        }
        
        # Read the log file
        with open(self.log_file, "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Skip entries before the cutoff date
                if row["timestamp"] < cutoff_date_str:
                    continue
                
                # Extract data
                model = row["model"]
                total_tokens = int(row["total_tokens"])
                estimated_cost = float(row["estimated_cost"])
                endpoint = row["endpoint"]
                date = row["timestamp"].split("T")[0]  # Extract date part
                
                # Update summary
                summary["total_requests"] += 1
                summary["total_tokens"] += total_tokens
                summary["total_cost"] += estimated_cost
                
                # Update model usage
                if model not in summary["model_usage"]:
                    summary["model_usage"][model] = {
                        "requests": 0,
                        "tokens": 0,
                        "cost": 0
                    }
                summary["model_usage"][model]["requests"] += 1
                summary["model_usage"][model]["tokens"] += total_tokens
                summary["model_usage"][model]["cost"] += estimated_cost
                
                # Update daily usage
                if date not in summary["daily_usage"]:
                    summary["daily_usage"][date] = {
                        "requests": 0,
                        "tokens": 0,
                        "cost": 0
                    }
                summary["daily_usage"][date]["requests"] += 1
                summary["daily_usage"][date]["tokens"] += total_tokens
                summary["daily_usage"][date]["cost"] += estimated_cost
                
                # Update endpoint usage
                if endpoint not in summary["endpoint_usage"]:
                    summary["endpoint_usage"][endpoint] = {
                        "requests": 0,
                        "tokens": 0,
                        "cost": 0
                    }
                summary["endpoint_usage"][endpoint]["requests"] += 1
                summary["endpoint_usage"][endpoint]["tokens"] += total_tokens
                summary["endpoint_usage"][endpoint]["cost"] += estimated_cost
        
        return summary
```

### Budget Alerts and Limits

```python
class APIBudgetManager:
    def __init__(self, monthly_budget=100.0, alert_thresholds=None, usage_tracker=None):
        """Initialize the API budget manager."""
        self.monthly_budget = monthly_budget
        self.alert_thresholds = alert_thresholds or [0.5, 0.8, 0.9, 0.95]
        self.alerted_thresholds = set()
        self.usage_tracker = usage_tracker or APIUsageTracker()
        
        # Reset alerts at the beginning of each month
        self._last_reset = datetime.datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    def check_budget_status(self):
        """Check the current budget status and trigger alerts if necessary."""
        # Check if we need to reset alerts (new month)
        now = datetime.datetime.now()
        if now.month != self._last_reset.month or now.year != self._last_reset.year:
            self.alerted_thresholds = set()
            self._last_reset = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Get current usage
        usage_summary = self.usage_tracker.get_usage_summary(days=30)
        current_spend = usage_summary["total_cost"]
        
        # Calculate percentage of budget used
        budget_used_percentage = (current_spend / self.monthly_budget) * 100
        
        # Check thresholds
        alerts = []
        for threshold in self.alert_thresholds:
            threshold_percentage = threshold * 100
            if budget_used_percentage >= threshold_percentage and threshold not in self.alerted_thresholds:
                alerts.append({
                    "threshold": threshold,
                    "threshold_percentage": threshold_percentage,
                    "current_spend": current_spend,
                    "budget": self.monthly_budget,
                    "budget_used_percentage": budget_used_percentage,
                    "message": f"Budget alert: {budget_used_percentage:.1f}% of monthly budget used (${current_spend:.2f} of ${self.monthly_budget:.2f})"
                })
                self.alerted_thresholds.add(threshold)
        
        return {
            "current_spend": current_spend,
            "monthly_budget": self.monthly_budget,
            "budget_used_percentage": budget_used_percentage,
            "budget_remaining": self.monthly_budget - current_spend,
            "alerts": alerts
        }
    
    def enforce_budget_limit(self, estimated_cost):
        """Check if a request would exceed the budget limit."""
        # Get current usage
        usage_summary = self.usage_tracker.get_usage_summary(days=30)
        current_spend = usage_summary["total_cost"]
        
        # Check if the request would exceed the budget
        if current_spend + estimated_cost > self.monthly_budget:
            return {
                "allowed": False,
                "reason": f"Budget limit reached. Current spend: ${current_spend:.2f}, Budget: ${self.monthly_budget:.2f}",
                "current_spend": current_spend,
                "budget_remaining": self.monthly_budget - current_spend,
                "estimated_cost": estimated_cost
            }
        
        return {
            "allowed": True,
            "current_spend": current_spend,
            "budget_remaining": self.monthly_budget - current_spend,
            "estimated_cost": estimated_cost
        }
    
    def log_and_check(self, model, prompt_tokens, completion_tokens, endpoint="chat.completions"):
        """Log usage and check budget status in one operation."""
        # Log the usage
        log_result = self.usage_tracker.log_usage(
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            endpoint=endpoint
        )
        
        # Check budget status
        budget_status = self.check_budget_status()
        
        return {
            "log_result": log_result,
            "budget_status": budget_status,
            "alerts": budget_status["alerts"]
        }
```

## Enterprise Considerations

For enterprise users, there are additional considerations for managing OpenAI API usage.

### Volume Discounts

OpenAI offers volume discounts for enterprise customers with high usage. These discounts can significantly reduce per-token costs for large-scale applications.

### Enterprise Agreements

Enterprise agreements with OpenAI can provide:

1. **Custom Rate Limits**: Higher rate limits to accommodate enterprise-scale applications
2. **SLAs**: Service Level Agreements for reliability and uptime
3. **Dedicated Support**: Priority support channels for enterprise customers
4. **Custom Features**: Access to custom features or model configurations

### Cost Allocation and Chargeback

For enterprises using the OpenAI API across multiple teams or projects, implementing cost allocation and chargeback mechanisms is important:

```python
class EnterpriseUsageTracker(APIUsageTracker):
    def __init__(self, log_file="enterprise_api_usage_log.csv"):
        """Initialize the enterprise API usage tracker with team/project tracking."""
        super().__init__(log_file)
        
        # Create log file with extended headers if it doesn't exist
        if not os.path.exists(log_file):
            with open(log_file, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "timestamp", "model", "prompt_tokens", "completion_tokens", 
                    "total_tokens", "estimated_cost", "request_id", "endpoint",
                    "team", "project", "user_id", "purpose"
                ])
    
    def log_usage(self, model, prompt_tokens, completion_tokens, endpoint="chat.completions", 
                  request_id=None, team=None, project=None, user_id=None, purpose=None):
        """Log API usage with team/project information for cost allocation."""
        # Calculate costs as in the parent class
        total_tokens = prompt_tokens + completion_tokens
        
        cost_per_1k_tokens = {
            "gpt-4o": {"input": 0.01, "output": 0.03},
            "gpt-4": {"input": 0.03, "output": 0.06},
            "gpt-3.5-turbo": {"input": 0.001, "output": 0.002},
            "text-embedding-3-small": {"input": 0.0001, "output": 0},
            "text-embedding-3-large": {"input": 0.001, "output": 0}
        }
        
        model_costs = cost_per_1k_tokens.get(model, {"input": 0.01, "output": 0.03})
        input_cost = (prompt_tokens / 1000) * model_costs["input"]
        output_cost = (completion_tokens / 1000) * model_costs["output"]
        estimated_cost = input_cost + output_cost
        
        # Generate request ID if not provided
        if request_id is None:
            request_id = f"req_{int(time.time())}_{os.urandom(4).hex()}"
        
        # Log to CSV with extended information
        with open(self.log_file, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.datetime.now().isoformat(),
                model,
                prompt_tokens,
                completion_tokens,
                total_tokens,
                estimated_cost,
                request_id,
                endpoint,
                team or "unknown",
                project or "unknown",
                user_id or "unknown",
                purpose or "unknown"
            ])
        
        return {
            "request_id": request_id,
            "estimated_cost": estimated_cost,
            "total_tokens": total_tokens
        }
    
    def get_team_usage_summary(self, days=30):
        """Get a summary of API usage by team for the specified number of days."""
        # Calculate the cutoff date
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        cutoff_date_str = cutoff_date.isoformat()
        
        # Initialize summary data
        summary = {
            "total_cost": 0,
            "team_usage": {},
            "project_usage": {},
            "user_usage": {}
        }
        
        # Read the log file
        with open(self.log_file, "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Skip entries before the cutoff date
                if row["timestamp"] < cutoff_date_str:
                    continue
                
                # Extract data
                estimated_cost = float(row["estimated_cost"])
                team = row.get("team", "unknown")
                project = row.get("project", "unknown")
                user_id = row.get("user_id", "unknown")
                
                # Update summary
                summary["total_cost"] += estimated_cost
                
                # Update team usage
                if team not in summary["team_usage"]:
                    summary["team_usage"][team] = 0
                summary["team_usage"][team] += estimated_cost
                
                # Update project usage
                if project not in summary["project_usage"]:
                    summary["project_usage"][project] = 0
                summary["project_usage"][project] += estimated_cost
                
                # Update user usage
                if user_id not in summary["user_usage"]:
                    summary["user_usage"][user_id] = 0
                summary["user_usage"][user_id] += estimated_cost
        
        return summary
    
    def generate_cost_allocation_report(self, month=None, year=None):
        """Generate a cost allocation report for a specific month."""
        # Default to current month if not specified
        if month is None or year is None:
            now = datetime.datetime.now()
            month = month or now.month
            year = year or now.year
        
        # Calculate start and end dates for the month
        start_date = datetime.datetime(year, month, 1)
        if month == 12:
            end_date = datetime.datetime(year + 1, 1, 1)
        else:
            end_date = datetime.datetime(year, month + 1, 1)
        
        start_date_str = start_date.isoformat()
        end_date_str = end_date.isoformat()
        
        # Initialize report data
        report = {
            "period": f"{year}-{month:02d}",
            "total_cost": 0,
            "team_allocation": {},
            "project_allocation": {},
            "user_allocation": {}
        }
        
        # Read the log file
        with open(self.log_file, "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Only include entries for the specified month
                if row["timestamp"] < start_date_str or row["timestamp"] >= end_date_str:
                    continue
                
                # Extract data
                estimated_cost = float(row["estimated_cost"])
                team = row.get("team", "unknown")
                project = row.get("project", "unknown")
                user_id = row.get("user_id", "unknown")
                
                # Update report
                report["total_cost"] += estimated_cost
                
                # Update team allocation
                if team not in report["team_allocation"]:
                    report["team_allocation"][team] = 0
                report["team_allocation"][team] += estimated_cost
                
                # Update project allocation
                if project not in report["project_allocation"]:
                    report["project_allocation"][project] = 0
                report["project_allocation"][project] += estimated_cost
                
                # Update user allocation
                if user_id not in report["user_allocation"]:
                    report["user_allocation"][user_id] = 0
                report["user_allocation"][user_id] += estimated_cost
        
        # Calculate percentages
        if report["total_cost"] > 0:
            for team, cost in report["team_allocation"].items():
                report["team_allocation"][team] = {
                    "cost": cost,
                    "percentage": (cost / report["total_cost"]) * 100
                }
            
            for project, cost in report["project_allocation"].items():
                report["project_allocation"][project] = {
                    "cost": cost,
                    "percentage": (cost / report["total_cost"]) * 100
                }
            
            for user, cost in report["user_allocation"].items():
                report["user_allocation"][user] = {
                    "cost": cost,
                    "percentage": (cost / report["total_cost"]) * 100
                }
        
        return report
```

In the next section, we'll explore future trends and developments in the OpenAI API ecosystem.
# Future Trends and Developments

## Emerging Capabilities and Features

The OpenAI API ecosystem continues to evolve rapidly, with new capabilities and features being developed to enhance its utility and accessibility.

### Multimodal Advancements

Multimodal AI, which can process and generate multiple types of media, represents one of the most significant trends in AI development:

1. **Enhanced Image Understanding**: Future models will likely have improved capabilities for understanding complex visual scenes, diagrams, and charts.

2. **Video Processing**: The ability to analyze and understand video content is a natural extension of current image capabilities.

3. **Audio Integration**: Voice input and output capabilities may be integrated more deeply into the API, enabling more natural conversational interfaces.

4. **Cross-modal Reasoning**: Future models will excel at reasoning across different modalities, such as answering questions about images or generating images based on text descriptions.

### Tool Use and Function Calling

The function calling capability is likely to expand in several ways:

1. **More Complex Tool Interactions**: Models may gain the ability to use tools in more sophisticated ways, including chaining multiple tools together.

2. **Autonomous Agents**: Future developments may enable the creation of more autonomous AI agents that can plan and execute complex tasks with minimal human intervention.

3. **Specialized Tool Libraries**: We may see the emergence of specialized tool libraries for different domains, such as data analysis, creative writing, or scientific research.

### Fine-tuning and Customization

Customization capabilities are expected to become more powerful and accessible:

1. **Simplified Fine-tuning**: The process of fine-tuning models may become more streamlined and require less technical expertise.

2. **Domain-Specific Optimization**: Models optimized for specific domains or industries may become more common.

3. **Personalization**: Models may gain the ability to adapt to individual users' preferences and communication styles over time.

## Preparing for Future API Changes

As the OpenAI API continues to evolve, developers should prepare for future changes to ensure their applications remain compatible and take advantage of new capabilities.

### Versioning and Compatibility

```python
class APIVersionManager:
    def __init__(self):
        """Initialize the API version manager."""
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
        
        # Define known model versions and their end-of-life dates
        self.model_eol_dates = {
            "gpt-3.5-turbo-0301": datetime.datetime(2024, 6, 13),
            "gpt-4-0314": datetime.datetime(2024, 7, 5),
            # Add more models and their EOL dates as announced
        }
    
    def check_model_status(self, model):
        """Check if a model is deprecated or approaching EOL."""
        # Check if the model has a known EOL date
        if model in self.model_eol_dates:
            eol_date = self.model_eol_dates[model]
            today = datetime.datetime.now()
            
            # Calculate days until EOL
            days_until_eol = (eol_date - today).days
            
            if days_until_eol < 0:
                return {
                    "status": "deprecated",
                    "message": f"Model {model} has been deprecated since {eol_date.strftime('%Y-%m-%d')}",
                    "recommendation": "Upgrade to a newer model version immediately."
                }
            elif days_until_eol < 30:
                return {
                    "status": "warning",
                    "message": f"Model {model} will be deprecated in {days_until_eol} days",
                    "recommendation": "Plan to upgrade to a newer model version soon."
                }
            else:
                return {
                    "status": "active",
                    "message": f"Model {model} is active but has a scheduled EOL date of {eol_date.strftime('%Y-%m-%d')}",
                    "recommendation": "Consider planning for an upgrade before the EOL date."
                }
        
        # For models without known EOL dates, check if they're latest pointers
        if model in ["gpt-3.5-turbo", "gpt-4", "gpt-4o"]:
            return {
                "status": "active_pointer",
                "message": f"Model {model} is a pointer to the latest version",
                "recommendation": "This model will automatically use the latest version, but behavior may change over time."
            }
        
        # For specific dated versions without known EOL
        if "-" in model and any(char.isdigit() for char in model):
            return {
                "status": "specific_version",
                "message": f"Model {model} is a specific version",
                "recommendation": "Monitor OpenAI announcements for deprecation notices."
            }
        
        # For unknown models
        return {
            "status": "unknown",
            "message": f"Model {model} status is unknown",
            "recommendation": "Verify this is a valid model identifier."
        }
    
    def get_recommended_upgrade_path(self, current_model):
        """Get the recommended upgrade path for a model."""
        # Define upgrade paths for known models
        upgrade_paths = {
            "gpt-3.5-turbo-0301": "gpt-3.5-turbo",
            "gpt-4-0314": "gpt-4",
            # Add more upgrade paths as needed
        }
        
        if current_model in upgrade_paths:
            return upgrade_paths[current_model]
        
        # For models without specific upgrade paths, recommend the latest in the same family
        if current_model.startswith("gpt-3.5"):
            return "gpt-3.5-turbo"
        elif current_model.startswith("gpt-4"):
            return "gpt-4o"
        
        # Default recommendation
        return "gpt-4o"
    
    def create_version_resilient_client(self, preferred_model=None, fallback_models=None):
        """Create a client that handles model versioning gracefully."""
        if preferred_model is None:
            preferred_model = "gpt-4o"
        
        if fallback_models is None:
            fallback_models = ["gpt-4", "gpt-3.5-turbo"]
        
        # Check the status of the preferred model
        model_status = self.check_model_status(preferred_model)
        
        if model_status["status"] == "deprecated":
            # If deprecated, use the recommended upgrade
            preferred_model = self.get_recommended_upgrade_path(preferred_model)
        
        # Create a wrapper function for chat completions
        def create_chat_completion(messages, temperature=0.7, max_tokens=None):
            models_to_try = [preferred_model] + fallback_models
            last_error = None
            
            for model in models_to_try:
                try:
                    response = self.client.chat.completions.create(
                        model=model,
                        messages=messages,
                        temperature=temperature,
                        max_tokens=max_tokens
                    )
                    
                    return {
                        "success": True,
                        "model_used": model,
                        "response": response,
                        "content": response.choices[0].message.content
                    }
                except Exception as e:
                    last_error = str(e)
                    print(f"Error with model {model}: {last_error}")
                    continue
            
            # If all models fail
            return {
                "success": False,
                "error": last_error
            }
        
        return create_chat_completion
```

### Staying Informed About API Changes

To stay informed about API changes and new features:

1. **Subscribe to the OpenAI Newsletter**: The official newsletter provides updates on new features, model releases, and deprecation notices.

2. **Follow the OpenAI Blog**: The blog often contains detailed information about new capabilities and best practices.

3. **Join the Developer Community**: Participating in forums and community discussions can provide early insights into changes and workarounds.

4. **Monitor the OpenAI Status Page**: The status page provides information about service disruptions and planned maintenance.

5. **Set Up Automated Monitoring**: Implement automated monitoring for API changes and deprecation notices:

```python
import requests
import json
import datetime
import os

class APIChangeMonitor:
    def __init__(self, cache_file="api_changes_cache.json"):
        """Initialize the API change monitor."""
        self.cache_file = cache_file
        self.last_check = None
        self.known_changes = []
        
        # Load cache if it exists
        if os.path.exists(cache_file):
            with open(cache_file, "r") as f:
                cache_data = json.load(f)
                self.last_check = datetime.datetime.fromisoformat(cache_data["last_check"])
                self.known_changes = cache_data["known_changes"]
    
    def check_for_changes(self):
        """Check for API changes and updates."""
        # In a real implementation, this would call an API or scrape the OpenAI website
        # For demonstration purposes, we'll simulate checking for changes
        
        # Record the check time
        current_time = datetime.datetime.now()
        
        # Simulate fetching changes
        new_changes = self._fetch_changes()
        
        # Filter out already known changes
        known_change_ids = [change["id"] for change in self.known_changes]
        truly_new_changes = [change for change in new_changes if change["id"] not in known_change_ids]
        
        # Update the cache
        self.known_changes.extend(truly_new_changes)
        self.last_check = current_time
        
        # Save the updated cache
        with open(self.cache_file, "w") as f:
            json.dump({
                "last_check": self.last_check.isoformat(),
                "known_changes": self.known_changes
            }, f, indent=2)
        
        return truly_new_changes
    
    def _fetch_changes(self):
        """Simulate fetching changes from the OpenAI API or website."""
        # In a real implementation, this would make HTTP requests
        # For demonstration, we'll return simulated changes
        
        return [
            {
                "id": "change-001",
                "date": "2025-03-15",
                "title": "GPT-4o Now Available",
                "description": "GPT-4o is now available through the API, offering improved performance and multimodal capabilities.",
                "impact": "low",
                "type": "new_feature"
            },
            {
                "id": "change-002",
                "date": "2025-04-01",
                "title": "GPT-3.5-turbo-0301 Deprecation",
                "description": "GPT-3.5-turbo-0301 will be deprecated on June 13, 2025. Please migrate to the latest GPT-3.5-turbo model.",
                "impact": "medium",
                "type": "deprecation"
            }
        ]
    
    def get_high_impact_changes(self, days=30):
        """Get high-impact changes from the last N days."""
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        
        high_impact_changes = []
        for change in self.known_changes:
            change_date = datetime.datetime.fromisoformat(change["date"])
            if change_date >= cutoff_date and change["impact"] in ["medium", "high"]:
                high_impact_changes.append(change)
        
        return high_impact_changes
```

## Community Resources and Support

The OpenAI API has a vibrant community of developers and resources that can help you stay up-to-date and solve problems.

### Official Resources

1. **OpenAI Documentation**: The official documentation is the primary source of information about the API.

2. **OpenAI Cookbook**: The cookbook contains practical examples and guides for common use cases.

3. **OpenAI Help Center**: The help center provides answers to frequently asked questions and troubleshooting guides.

### Community Resources

1. **GitHub Repositories**: Many developers share their projects and examples on GitHub.

2. **Stack Overflow**: Stack Overflow has a growing number of questions and answers related to the OpenAI API.

3. **Reddit Communities**: Subreddits like r/OpenAI and r/MachineLearning often discuss API-related topics.

4. **Discord Servers**: Several Discord servers are dedicated to AI development and the OpenAI API.

### Building Your Own Knowledge Base

Creating your own knowledge base of API information and examples can be valuable:

```python
class APIKnowledgeBase:
    def __init__(self, base_dir="openai_api_knowledge"):
        """Initialize the API knowledge base."""
        self.base_dir = base_dir
        
        # Create the base directory if it doesn't exist
        os.makedirs(base_dir, exist_ok=True)
        
        # Create subdirectories for different types of information
        self.directories = {
            "examples": os.path.join(base_dir, "examples"),
            "errors": os.path.join(base_dir, "errors"),
            "solutions": os.path.join(base_dir, "solutions"),
            "best_practices": os.path.join(base_dir, "best_practices")
        }
        
        for directory in self.directories.values():
            os.makedirs(directory, exist_ok=True)
    
    def add_example(self, title, code, description, tags=None):
        """Add a code example to the knowledge base."""
        if tags is None:
            tags = []
        
        # Create a filename from the title
        filename = self._create_filename(title)
        filepath = os.path.join(self.directories["examples"], filename)
        
        # Create the example content
        content = f"""# {title}

## Description
{description}

## Tags
{', '.join(tags)}

## Code
```python
{code}
```

## Date Added
{datetime.datetime.now().strftime('%Y-%m-%d')}
"""
        
        # Save the example
        with open(filepath, "w") as f:
            f.write(content)
        
        return filepath
    
    def add_error_solution(self, error_message, solution, context=None, tags=None):
        """Add an error solution to the knowledge base."""
        if tags is None:
            tags = []
        
        if context is None:
            context = ""
        
        # Create a filename from the error message
        filename = self._create_filename(error_message[:50])
        filepath = os.path.join(self.directories["errors"], filename)
        
        # Create the error solution content
        content = f"""# Error: {error_message}

## Context
{context}

## Solution
{solution}

## Tags
{', '.join(tags)}

## Date Added
{datetime.datetime.now().strftime('%Y-%m-%d')}
"""
        
        # Save the error solution
        with open(filepath, "w") as f:
            f.write(content)
        
        return filepath
    
    def add_best_practice(self, title, content, category=None, tags=None):
        """Add a best practice to the knowledge base."""
        if tags is None:
            tags = []
        
        if category is None:
            category = "General"
        
        # Create a filename from the title
        filename = self._create_filename(title)
        filepath = os.path.join(self.directories["best_practices"], filename)
        
        # Create the best practice content
        formatted_content = f"""# {title}

## Category
{category}

## Best Practice
{content}

## Tags
{', '.join(tags)}

## Date Added
{datetime.datetime.now().strftime('%Y-%m-%d')}
"""
        
        # Save the best practice
        with open(filepath, "w") as f:
            f.write(formatted_content)
        
        return filepath
    
    def search(self, query, categories=None):
        """Search the knowledge base for entries matching the query."""
        if categories is None:
            categories = list(self.directories.keys())
        
        results = []
        
        for category in categories:
            if category not in self.directories:
                continue
            
            directory = self.directories[category]
            
            for filename in os.listdir(directory):
                filepath = os.path.join(directory, filename)
                
                with open(filepath, "r") as f:
                    content = f.read()
                
                if query.lower() in content.lower():
                    # Extract the title from the first line
                    title = content.split("\n")[0].strip("# ")
                    
                    results.append({
                        "category": category,
                        "title": title,
                        "filepath": filepath,
                        "preview": content[:200] + "..." if len(content) > 200 else content
                    })
        
        return results
    
    def _create_filename(self, title):
        """Create a filename from a title."""
        # Replace spaces with underscores and remove special characters
        filename = "".join(c if c.isalnum() or c == " " else "_" for c in title)
        filename = filename.replace(" ", "_").lower()
        
        # Add .md extension
        return f"{filename}.md"
```

## Conclusion and Next Steps

The OpenAI API represents a powerful tool for developers looking to integrate advanced AI capabilities into their applications. By understanding its features, best practices, and future trends, you can leverage its full potential while managing costs and ensuring reliability.

### Key Takeaways

1. **Understand the API Structure**: Familiarize yourself with the different components of the API, including the Chat Completions API, Responses API, and specialized services.

2. **Choose the Right Model**: Select the appropriate model for your use case based on capability requirements, context length needs, and budget constraints.

3. **Implement Best Practices**: Follow best practices for error handling, rate limiting, and security to build robust applications.

4. **Optimize for Cost**: Use techniques like caching, batching, and prompt optimization to manage API costs effectively.

5. **Stay Informed**: Keep up with API changes and new features to ensure your applications remain compatible and take advantage of new capabilities.

### Getting Started

If you're new to the OpenAI API, here are some recommended next steps:

1. **Create an OpenAI Account**: Sign up at [platform.openai.com](https://platform.openai.com) to get your API key.

2. **Explore the Documentation**: Review the official documentation to understand the API's capabilities and limitations.

3. **Start with Simple Examples**: Begin with basic examples to familiarize yourself with the API before building more complex applications.

4. **Join the Community**: Engage with the developer community to learn from others' experiences and share your own.

5. **Experiment and Iterate**: The best way to learn is by doing. Start building, experiment with different approaches, and iterate based on results.

By following these guidelines and leveraging the information in this guide, you'll be well-equipped to build powerful, cost-effective applications with the OpenAI API.

Happy building!
