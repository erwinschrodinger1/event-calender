# syntax=docker/dockerfile:1

FROM python:3.9

WORKDIR /python-docker

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "rq worker --url redis://redis:6379  default & python3 -m flask run --host=0.0.0.0"]
