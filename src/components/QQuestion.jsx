import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
} from "@nextui-org/react";

const QQuestion = () => (
  <Card className="my-3">
    <CardHeader className="justify-between">
      <div className="flex gap-5">
        <Avatar
          isBordered
          radius="full"
          size="md"
          src="/avatars/avatar-1.png"
        />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            Zoey Lang
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            @zoeylang
          </h5>
        </div>
        <Divider orientation="vertical" />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h3>Quel est mon âge ?</h3>
        </div>
      </div>
      <Button color="primary" radius="full" size="sm" variant={"solid"}>
        Follow
      </Button>
    </CardHeader>
    <CardBody className="px-3 py-0 text-small text-default-400">
      <p>Tu as 18 ans !</p>
      <span className="pt-2">
        #WhatsMyAge
        <span className="py-2" aria-label="computer" role="img">
          💻
        </span>
      </span>
    </CardBody>
    <CardFooter className="gap-3">
      <div className="flex gap-1">
        <p className="font-semibold text-default-400 text-small">10K</p>
        <p className="text-default-400 text-small">Liked this answer</p>
      </div>
      <div className="flex gap-1">
        <p className="font-semibold text-default-400 text-small">9.99K</p>
        <p className=" text-default-400 text-small">more answers</p>
      </div>

      <Divider orientation="vertical" />
      <div className="flex gap-1">
        <Link>See more answers</Link>
        <Divider orientation="vertical" />
        <Link>Add answer</Link>
        <Divider orientation="vertical" />
        <Link>Report</Link>
      </div>
    </CardFooter>
  </Card>
);

export default QQuestion;
