num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

if num2 == 0:
    print("Error! Cannot divide by zero.")
else:
    result = num1 / num2
    print("Answer:", format(result, ".15f"))
