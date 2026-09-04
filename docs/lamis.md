name = "Lamis"

def greet(name):
    return f"Hello {name}"

print(greet(name))

print("Welcome to My First AI")
# algorithm 

numbers = [5, 2, 8, 1]

largest = numbers[0]

for n in numbers:
    if n > largest:
        largest = n

print(largest)
# rule
while True:
    user = input("You: ").lower()

    if "hello" in user:
        print("AI: Hi!")
    elif "bye" in user:
        print("AI: Goodbye!")
        break
    else:
        print("AI: I don't understand.")
user = input("You: ")

print("AI:", user)

# remember information.
name = input("What is your name? ")

print("Hello", name)
# Making decisions
user = input("You: ").lower()
if user == "hello":
    print("AI: Hi!")
else:
    print("AI: I don't know that.")
    
    # Multiple decisions
    user = input("You: ").lower()

if user == "hello":
    print("AI: Hi!")

elif user == "how are you":
    print("AI: I'm doing well.")

elif user == "bye":
    print("AI: Goodbye!")

else:
    print("AI: I don't understand.")
    
    # repeat conversation 
    print("Mini AI Started")

while True:

    user = input("You: ").lower()

    if user == "hello":
        print("AI: Hi!")

    elif user == "how are you":
        print("AI: I'm great!")

    elif user == "bye":
        print("AI: See you later!")
        break

    else:
        print("AI: I don't understand.")
        # learn algorithms machine learning 
        from sklearn.tree import DecisionTreeClassifier

X = [
    [18],
    [25],
    [40],
    [60]
]

y = [
    "Teen",
    "Adult",
    "Adult",
    "Senior"
]

model = DecisionTreeClassifier()
model.fit(X, y)

print(model.predict([[30]]))

# use PyTorch 
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(2, 4),
    nn.ReLU(),
    nn.Linear(4, 1)
)

# undergo training daily 
for epoch in range(100):
    prediction = model(inputs)
    loss = loss_function(prediction, target)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```
memory.py

```python

print("=== Memory AI ===")

name = input("AI: What is your name?\nYou: ")

print("AI: Nice to meet you,", name)

while True:
    user = input(f"{name}: ").lower()

    if user == "hello":
        print(f"AI: Hello {name}!")

    elif user == "my name":
        print(f"AI: Your name is {name}.")

    elif user == "bye":
        print("AI: Goodbye!")
        break

    else:
        print("AI: Tell me more.")
        
        # multiple memories including the beginning of time
        name = input("Your name: ")
city = input("Your city: ")
language = input("Favorite programming language: ")

print()

print("Summary")
print("Name:", name)
print("City:", city)
print("Language:", language)
# build knowledge base for creator first 
person = {
    "name": "Yakub",
    "age": 23,
    "country": "Nigeria"
}

print(person["name"])
print(person["country"])

# build knowledge 
knowledge = {
    "python": "Python is a programming language.",
    "ai": "Artificial Intelligence allows computers to perform tasks that normally require human intelligence.",
    "rust": "Rust is a systems programming language focused on safety and performance.",
    "blockchain": "Blockchain is a distributed ledger technology."
    “Q-lang”: Q language is a semantic computing language designed to understand, define, analyze, learn, coordinate, and execute any digital or conceptual object.”
}
# ask questions 
knowledge = {
    "python": "Python is a programming language.",
    "ai": "Artificial Intelligence allows computers to perform tasks requiring human intelligence.",
    "rust": "Rust is fast and memory-safe.",
    "blockchain": "Blockchain stores data securely across many computers."
    “Q-lang”: Q language is a semantic computing language designed to understand, define, analyze, learn, coordinate, and execute any digital or conceptual object.”
}

print("Knowledge AI")

while True:

    question = input("Ask: ").lower()

    if question == "bye":
        break

    if question in knowledge:
        print("AI:", knowledge[question])
    else:
        print("I don't know that yet.")
        
        # learn new things 
            “Q-lang”: Q language is a semantic computing language designed to understand, define, analyze, learn, coordinate, and execute any digital or conceptual object.”
            knowledge = {}

while True:

    question = input("Ask: ").lower()

    if question == "bye":
        break

    if question in knowledge:
        print(knowledge[question])

    else:
        answer = input("Teach me: ")
        knowledge[question] = answer
        # always save what you learnt 
        import json

knowledge = {
    "python": "Programming language",
    "ai": "Artificial Intelligence"
}

with open("brain.json", "w") as file:
    json.dump(knowledge, file, indent=4)
    
    {
    "python": "Programming language",
    "ai": "Artificial Intelligence"
}
{
    "Q-lang": "semantic computing language designed to understand, define, analyze, learn, coordinate, and execute any digital or conceptual object",
    "ai": "Artificial Intelligence"
}
# load memory or knowledge 
import json

with open("brain.json", "r") as file:
    knowledge = json.load(file)

print(knowledge)

# create multiple neurons 
def neuron(inputs, weights, bias):
    output = bias

    for i in range(len(inputs)):
        output += inputs[i] * weights[i]

    if output < 0:
        output = 0

    return output
    inputs = [1, 2, 3]

weights1 = [0.2, 0.5, 0.8]
weights2 = [0.7, 0.1, 0.3]
weights3 = [0.4, 0.6, 0.9]

bias1 = 1
bias2 = 0
bias3 = -1

# layer
output1 = neuron(inputs, weights1, bias1)
output2 = neuron(inputs, weights2, bias2)
output3 = neuron(inputs, weights3, bias3)

print(output1)
print(output2)
print(output3)

# store it
layer_output = [
    output1,
    output2,
    output3
]

print(layer_output)
# training loop
weight = 0.5
learning_rate = 0.1

target = 10
input_value = 5

for epoch in range(10):

    prediction = input_value * weight

    loss = target - prediction

    weight = weight + learning_rate * loss

    print(
        "Epoch:", epoch,
        "Prediction:", prediction,
        "Loss:", loss,
        "Weight:", weight
    )
    weight = 0.5
loss = 3
learning_rate = 0.1

weight = weight + learning_rate * loss

print(weight)

#include <iostream>
#include <cmath>

inline float fast_log(float val)
{
   int * const exp_ptr = reinterpret_cast <int *>(&val);
   int x = *exp_ptr;
   const int log_2 = ((x >> 23) & 255) - 128;
   x &= ~(255 << 23);
   x += 127 << 23;
   *exp_ptr = x;

   val = ((-1.0f/3) * val + 2) * val - 2.0f/3;
   return ((val + log_2) * 0.69314718f);
} 

float difficulty(unsigned int bits)
{
    static double max_body = fast_log(0x00ffff), scaland = fast_log(256);
    return exp(max_body - fast_log(bits & 0x00ffffff) + scaland * (0x1d - ((bits & 0xff000000) >> 24)));
}

int main()
{
    std::cout << difficulty(0x1b0404cb) << std::endl;
    return 0;
}

import decimal, math
l = math.log
e = math.e

print 0x00ffff * 2**(8*(0x1d - 3)) / float(0x0404cb * 2**(8*(0x1b - 3)))
print l(0x00ffff * 2**(8*(0x1d - 3)) / float(0x0404cb * 2**(8*(0x1b - 3))))
print l(0x00ffff * 2**(8*(0x1d - 3))) - l(0x0404cb * 2**(8*(0x1b - 3)))
print l(0x00ffff) + l(2**(8*(0x1d - 3))) - l(0x0404cb) - l(2**(8*(0x1b - 3)))
print l(0x00ffff) + (8*(0x1d - 3))*l(2) - l(0x0404cb) - (8*(0x1b - 3))*l(2)
print l(0x00ffff / float(0x0404cb)) + (8*(0x1d - 3))*l(2) - (8*(0x1b - 3))*l(2)
print l(0x00ffff / float(0x0404cb)) + (0x1d - 0x1b)*l(2**8)
