export interface PrebidBidRequestItem {
  bidId: string;
  placementId: string;
  sizes?: [number, number][];
  banner?: {
    sizes?: [number, number][];
  };
  video?: {
    playerSize?: [number, number][];
    context?: string;
    mimes?: string[];
    protocols?: number[];
    minduration?: number;
    maxduration?: number;
    startdelay?: number;
    playbackmethod?: number[];
    api?: number[];
    skip?: number;
    skipafter?: number;
    placement?: number;
    plcmt?: number;
    linearity?: number;
  };
  floor?: number;
  floorCurrency?: string;
  gpid?: string;
  params?: Record<string, any>;
}

export interface PrebidBidRequestBody {
  id: string; // Auction ID
  page?: string;
  domain?: string;
  referer?: string;
  site?: Record<string, any>;
  device?: {
    ua?: string;
    ip?: string;
    w?: number;
    h?: number;
    dnt?: number;
    language?: string;
  };
  eids?: any[];
  schain?: any;
  bcat?: string[];
  badv?: string[];
  consent?: {
    gdprApplies?: boolean;
    consentString?: string;
    uspConsent?: string;
    gppString?: string;
    gppSid?: string;
  };
  bids: PrebidBidRequestItem[];
}

export interface MonetiseUpBidResult {
  bidId: string;
  cpm: number;
  currency: string;
  width: number;
  height: number;
  creativeId: string;
  mediaType?: 'banner' | 'video';
  adHtml?: string;
  vastUrl?: string;
  vastXml?: string;
  adomain: string[];
  demandSource: string;
  dealId?: string;
}

// OpenRTB 2.5 Structures for Demand Partners (like Adagio)
export interface OpenRtbBanner {
  w?: number;
  h?: number;
  format?: { w: number; h: number }[];
  pos?: number;
}

export interface OpenRtbImp {
  id: string;
  tagid?: string;
  banner?: OpenRtbBanner;
  bidfloor?: number;
  bidfloorcur?: string;
  ext?: Record<string, any>;
}

export interface OpenRtbBidRequest {
  id: string;
  imp: OpenRtbImp[];
  site?: {
    page?: string;
    domain?: string;
    ref?: string;
  };
  device?: {
    ua?: string;
    ip?: string;
    language?: string;
    w?: number;
    h?: number;
    dnt?: number;
  };
  user?: {
    id?: string;
    ext?: {
      consent?: string;
    };
  };
  regs?: {
    coppa?: number;
    ext?: {
      gdpr?: number;
      us_privacy?: string;
    };
  };
  tmax?: number;
}

export interface OpenRtbBid {
  id: string;
  impid: string;
  price: number;
  adm: string;
  adid?: string;
  adomain?: string[];
  iurl?: string;
  cid?: string;
  crid?: string;
  w?: number;
  h?: number;
  dealid?: string;
}

export interface OpenRtbSeatBid {
  bid: OpenRtbBid[];
  seat?: string;
}

export interface OpenRtbBidResponse {
  id: string;
  seatbid?: OpenRtbSeatBid[];
  bidid?: string;
  cur?: string;
  nbr?: number;
}
