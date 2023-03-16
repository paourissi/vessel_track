import { useQuery } from "react-query";
import VesselTrackService from "./vessel-track.service";

const fetchVesselTracks = ({ queryKey: [, params] }) =>
  VesselTrackService.vesselTracking(params).then((response) => response.data);

const useVesselTrackQuery = (params, options = {}) => {
  const QUERY_KEY = "VESSEL_TRACK_QUERY_KEY";

  return useQuery(
    [QUERY_KEY, { protocol: "jsono", ...params }],
    fetchVesselTracks,
    { ...options }
  );
};

export default useVesselTrackQuery;
