import { log } from "@graphprotocol/graph-ts";
import { Item, Registry, Request } from "../../generated/schema";
import { Curate, RequestSubmitted } from "../../generated/templates/Curate/Curate";
import { NONE, ONE, REGISTRATION_REQUESTED, ZERO, ZERO_ADDRESS } from "../utils";

export function createRequestFromEvent(event: RequestSubmitted): void {
  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();

  let curate = Curate.bind(event.address);
  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Item for graphItemID {} not found.`, [graphItemID]);
    return;
  }
  let registry = Registry.load(event.address.toHexString());
  if (!registry) {
    log.error(`Registry at address {} not found`, [event.address.toHexString()]);
    return;
  }
  const requestIndex = item.numberOfRequests.minus(ONE);
  const requestID = graphItemID + "-" + requestIndex.toString();
  const request = new Request(requestID);
  request.disputed = false;
  request.arbitrator = curate.getArbitrator();
  request.arbitratorExtraData = curate.getArbitratorExtraData();
  request.challenger = ZERO_ADDRESS;
  request.requester = event.transaction.from;
  request.item = item.id;
  request.registry = registry.id;
  request.registryAddress = event.address;
  request.resolutionTime = ZERO;
  request.disputeOutcome = NONE;
  request.resolved = false;
  request.disputeID = ZERO;
  request.submissionTime = event.block.timestamp;
  request.requestType = item.status;
  request.creationTx = event.transaction.hash;

  if (request.requestType == REGISTRATION_REQUESTED) {
    request.deposit = curate.submissionBaseDeposit();
  } else {
    request.deposit = curate.removalBaseDeposit();
  }
  request.save();
}
