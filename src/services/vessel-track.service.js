import axios from "axios";
import { APIs } from "./APIs";
import queryString from "query-string";

queryString.stringify({ foo: ["one", "two"] }, { arrayFormat: "" });

export default class VesselTrackService {
  static vesselTracking(params) {
    const stringifyParams = queryString
      .stringify(params)
      .replaceAll("&", "/")
      .replaceAll("=", ":");
    return axios.get(`${APIs.VESSEL_TRACK}${stringifyParams}`);
  }
}
