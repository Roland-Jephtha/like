(function() {
    try {
        var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {};
        e.SENTRY_RELEASE = {
            id: "343261f585cbb0f1445c85d7d910aa103bf69a89"
        };
        var t = new e.Error().stack;
        t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "1a48910a-88fa-44b3-b6a1-872bcea14707", e._sentryDebugIdIdentifier = "sentry-dbid-1a48910a-88fa-44b3-b6a1-872bcea14707")
    } catch {}
})();
const Y = "https://mainnet.zklighter.elliot.ai".replace(/\/+$/, "");
let Q = class {
    constructor(t = {}) {
        this.configuration = t
    }
    set config(t) {
        this.configuration = t
    }
    get basePath() {
        return this.configuration.basePath != null ? this.configuration.basePath : Y
    }
    get fetchApi() {
        return this.configuration.fetchApi
    }
    get middleware() {
        return this.configuration.middleware || []
    }
    get queryParamsStringify() {
        return this.configuration.queryParamsStringify || z
    }
    get username() {
        return this.configuration.username
    }
    get password() {
        return this.configuration.password
    }
    get apiKey() {
        const t = this.configuration.apiKey;
        if (t) return typeof t == "function" ? t : () => t
    }
    get accessToken() {
        const t = this.configuration.accessToken;
        if (t) return typeof t == "function" ? t : async () => t
    }
    get headers() {
        return this.configuration.headers
    }
    get credentials() {
        return this.configuration.credentials
    }
};
const X = new Q;
let p = class E {
    constructor(t = X) {
        this.configuration = t, this.middleware = t.middleware
    }
    static jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
    middleware;
    withMiddleware(...t) {
        const i = this.clone();
        return i.middleware = i.middleware.concat(...t), i
    }
    withPreMiddleware(...t) {
        const i = t.map(n => ({
            pre: n
        }));
        return this.withMiddleware(...i)
    }
    withPostMiddleware(...t) {
        const i = t.map(n => ({
            post: n
        }));
        return this.withMiddleware(...i)
    }
    isJsonMime(t) {
        return t ? E.jsonRegex.test(t) : !1
    }
    async request(t, i) {
        const {
            url: n,
            init: a
        } = await this.createFetchParams(t, i), o = await this.fetchApi(n, a);
        if (o && o.status >= 200 && o.status < 300) return o;
        throw new j(o, "Response returned an error code")
    }
    async createFetchParams(t, i) {
        let n = this.configuration.basePath + t.path;
        t.query !== void 0 && Object.keys(t.query).length !== 0 && (n += "?" + this.configuration.queryParamsStringify(t.query));
        const a = Object.assign({}, this.configuration.headers, t.headers);
        Object.keys(a).forEach(g => a[g] === void 0 ? delete a[g] : {});
        const o = typeof i == "function" ? i : async () => i,
            r = {
                method: t.method,
                headers: a,
                body: t.body,
                credentials: this.configuration.credentials
            },
            l = { ...r,
                ...await o({
                    init: r,
                    context: t
                })
            };
        let d;
        P(l.body) || l.body instanceof URLSearchParams || q(l.body) ? d = l.body : this.isJsonMime(a["Content-Type"]) ? d = JSON.stringify(l.body) : d = l.body;
        const x = { ...l,
            body: d
        };
        return {
            url: n,
            init: x
        }
    }
    fetchApi = async (t, i) => {
        let n = {
            url: t,
            init: i
        };
        for (const o of this.middleware) o.pre && (n = await o.pre({
            fetch: this.fetchApi,
            ...n
        }) || n);
        let a;
        try {
            a = await (this.configuration.fetchApi || fetch)(n.url, n.init)
        } catch (o) {
            for (const r of this.middleware) r.onError && (a = await r.onError({
                fetch: this.fetchApi,
                url: n.url,
                init: n.init,
                error: o,
                response: a ? a.clone() : void 0
            }) || a);
            if (a === void 0) throw o instanceof Error ? new ee(o, "The request failed and the interceptors did not return an alternative response") : o
        }
        for (const o of this.middleware) o.post && (a = await o.post({
            fetch: this.fetchApi,
            url: n.url,
            init: n.init,
            response: a.clone()
        }) || a);
        return a
    };
    clone() {
        const t = this.constructor,
            i = new t(this.configuration);
        return i.middleware = this.middleware.slice(), i
    }
};

function q(e) {
    return typeof Blob < "u" && e instanceof Blob
}

function P(e) {
    return typeof FormData < "u" && e instanceof FormData
}
let j = class extends Error {
        constructor(t, i) {
            super(i), this.response = t
        }
        name = "ResponseError"
    },
    ee = class extends Error {
        constructor(t, i) {
            super(i), this.cause = t
        }
        name = "FetchError"
    },
    u = class extends Error {
        constructor(t, i) {
            super(i), this.field = t
        }
        name = "RequiredError"
    };
const O = {
    csv: ","
};

function z(e, t = "") {
    return Object.keys(e).map(i => I(i, e[i], t)).filter(i => i.length > 0).join("&")
}

function I(e, t, i = "") {
    const n = i + (i.length ? `[${e}]` : e);
    if (t instanceof Array) {
        const a = t.map(o => encodeURIComponent(String(o))).join(`&${encodeURIComponent(n)}=`);
        return `${encodeURIComponent(n)}=${a}`
    }
    if (t instanceof Set) {
        const a = Array.from(t);
        return I(e, a, i)
    }
    return t instanceof Date ? `${encodeURIComponent(n)}=${encodeURIComponent(t.toISOString())}` : t instanceof Object ? z(t, n) : `${encodeURIComponent(n)}=${encodeURIComponent(String(t))}`
}

function s(e) {
    for (const t of e)
        if (t.contentType === "multipart/form-data") return !0;
    return !1
}
let c = class {
    constructor(t, i = n => n) {
        this.raw = t, this.transformer = i
    }
    async value() {
        return this.transformer(await this.raw.json())
    }
};

function te(e) {
    return ne(e)
}

function ne(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        account_type: e.account_type,
        index: e.index,
        l1_address: e.l1_address,
        cancel_all_time: e.cancel_all_time,
        total_order_count: e.total_order_count,
        total_isolated_order_count: e.total_isolated_order_count,
        pending_order_count: e.pending_order_count,
        available_balance: e.available_balance,
        status: e.status,
        collateral: e.collateral,
        transaction_time: e.transaction_time,
        account_trading_mode: e.account_trading_mode == null ? void 0 : e.account_trading_mode
    }
}

function ie(e) {
    return ae(e)
}

function ae(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        api_key_index: e.api_key_index,
        nonce: e.nonce,
        public_key: e.public_key,
        transaction_time: e.transaction_time
    }
}

function re(e) {
    return oe(e)
}

function oe(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        api_keys: e.api_keys.map(ie)
    }
}

function G(e) {
    return ue(e)
}

function ue(e, t) {
    return e == null ? e : {
        symbol: e.symbol,
        asset_id: e.asset_id,
        balance: e.balance,
        locked_balance: e.locked_balance
    }
}

function ce(e) {
    return le(e)
}

function le(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        max_llp_percentage: e.max_llp_percentage,
        max_llp_amount: e.max_llp_amount,
        user_tier: e.user_tier,
        can_create_public_pool: e.can_create_public_pool,
        current_maker_fee_tick: e.current_maker_fee_tick,
        current_taker_fee_tick: e.current_taker_fee_tick,
        leased_lit: e.leased_lit,
        effective_lit_stakes: e.effective_lit_stakes
    }
}

function de(e) {
    return se(e)
}

function se(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        name: e.name,
        description: e.description,
        can_invite: e.can_invite,
        referral_points_percentage: e.referral_points_percentage,
        created_at: e.created_at
    }
}

function _e(e) {
    return pe(e)
}

function pe(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        account_metadatas: e.account_metadatas.map(de)
    }
}

function me(e) {
    return fe(e)
}

function fe(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        trade_pnl: e.trade_pnl,
        trade_spot_pnl: e.trade_spot_pnl,
        inflow: e.inflow,
        outflow: e.outflow,
        spot_outflow: e.spot_outflow,
        spot_inflow: e.spot_inflow,
        pool_pnl: e.pool_pnl,
        pool_inflow: e.pool_inflow,
        pool_outflow: e.pool_outflow,
        staking_pnl: e.staking_pnl,
        staking_inflow: e.staking_inflow,
        staking_outflow: e.staking_outflow,
        pool_total_shares: e.pool_total_shares,
        staked_lit: e.staked_lit
    }
}

function he(e) {
    return we(e)
}

function we(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        resolution: e.resolution,
        pnl: e.pnl.map(me)
    }
}

function C(e) {
    return ge(e)
}

function ge(e, t) {
    return e == null ? e : {
        market_id: e.market_id,
        symbol: e.symbol,
        initial_margin_fraction: e.initial_margin_fraction,
        open_order_count: e.open_order_count,
        pending_order_count: e.pending_order_count,
        position_tied_order_count: e.position_tied_order_count,
        sign: e.sign,
        position: e.position,
        avg_entry_price: e.avg_entry_price,
        position_value: e.position_value,
        unrealized_pnl: e.unrealized_pnl,
        realized_pnl: e.realized_pnl,
        liquidation_price: e.liquidation_price,
        total_funding_paid_out: e.total_funding_paid_out == null ? void 0 : e.total_funding_paid_out,
        margin_mode: e.margin_mode,
        allocated_margin: e.allocated_margin,
        total_discount: e.total_discount
    }
}

function ye(e) {
    return xe(e)
}

function xe(e, t) {
    return e == null ? e : {
        l1_address: e.l1_address,
        allocation: e.allocation
    }
}

function ke(e) {
    return be(e)
}

function be(e, t) {
    return e == null ? e : {
        l1_address: e.l1_address,
        allocations: e.allocations.map(ye)
    }
}

function Se(e) {
    return Re(e)
}

function Re(e, t) {
    return e == null ? e : {
        title: e.title,
        content: e.content,
        created_at: e.created_at,
        expired_at: e.expired_at
    }
}

function Te(e) {
    return Oe(e)
}

function Oe(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        announcements: e.announcements.map(Se)
    }
}

function Fe(e) {
    return ve(e)
}

function ve(e, t) {
    return e == null ? e : {
        token_id: e.token_id,
        api_token: e.api_token,
        name: e.name,
        account_index: e.account_index,
        expiry: e.expiry,
        sub_account_access: e.sub_account_access,
        revoked: e.revoked,
        scopes: e.scopes
    }
}

function Ne(e) {
    return Je(e)
}

function Je(e, t) {
    return e == null ? e : {
        asset_id: e.asset_id,
        symbol: e.symbol,
        l1_decimals: e.l1_decimals,
        decimals: e.decimals,
        min_transfer_amount: e.min_transfer_amount,
        min_withdrawal_amount: e.min_withdrawal_amount,
        margin_mode: e.margin_mode,
        index_price: e.index_price,
        l1_address: e.l1_address
    }
}

function De(e) {
    return Le(e)
}

function Le(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        asset_details: e.asset_details.map(Ne)
    }
}

function Ae(e) {
    return Ee(e)
}

function Ee(e, t) {
    return e == null ? e : {
        hash: e.hash,
        type: e.type,
        info: e.info,
        event_info: e.event_info,
        status: e.status,
        transaction_index: e.transaction_index,
        l1_address: e.l1_address,
        account_index: e.account_index,
        nonce: e.nonce,
        expire_at: e.expire_at,
        block_height: e.block_height,
        queued_at: e.queued_at,
        executed_at: e.executed_at,
        sequence_index: e.sequence_index,
        parent_hash: e.parent_hash,
        api_key_index: e.api_key_index,
        transaction_time: e.transaction_time
    }
}

function ze(e) {
    return Ie(e)
}

function Ie(e, t) {
    return e == null ? e : {
        id: e.id,
        version: e.version,
        source: e.source,
        source_chain_id: e.source_chain_id,
        fast_bridge_tx_hash: e.fast_bridge_tx_hash,
        batch_claim_tx_hash: e.batch_claim_tx_hash,
        cctp_burn_tx_hash: e.cctp_burn_tx_hash,
        amount: e.amount,
        intent_address: e.intent_address,
        status: e.status,
        step: e.step,
        description: e.description,
        created_at: e.created_at,
        updated_at: e.updated_at,
        is_external_deposit: e.is_external_deposit
    }
}

function Ge(e) {
    return Ce(e)
}

function Ce(e, t) {
    return e == null ? e : {
        name: e.name,
        chain_id: e.chain_id,
        explorer: e.explorer
    }
}

function Be(e) {
    return Ue(e)
}

function Ue(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        networks: e.networks.map(Ge)
    }
}

function Me(e) {
    return He(e)
}

function He(e, t) {
    return e == null ? e : {
        t: e.t,
        o: e.o,
        h: e.h,
        l: e.l,
        c: e.c,
        O: e.O,
        H: e.H,
        L: e.L,
        C: e.C,
        v: e.v,
        V: e.V,
        i: e.i
    }
}

function $e(e) {
    return We(e)
}

function We(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        r: e.r,
        c: e.c.map(Me)
    }
}

function Ve(e) {
    return Ke(e)
}

function Ke(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        open: e.open,
        high: e.high,
        low: e.low,
        close: e.close,
        open_raw: e.open_raw,
        high_raw: e.high_raw,
        low_raw: e.low_raw,
        close_raw: e.close_raw,
        volume0: e.volume0,
        volume1: e.volume1,
        last_trade_id: e.last_trade_id,
        trade_count: e.trade_count
    }
}

function Ze(e) {
    return Ye(e)
}

function Ye(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        resolution: e.resolution,
        candlesticks: e.candlesticks.map(Ve)
    }
}

function Qe(e) {
    return Xe(e)
}

function Xe(e, t) {
    return e == null ? e : {
        name: e.name,
        address: e.address
    }
}

function qe(e) {
    return Pe(e)
}

function Pe(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        intent_address: e.intent_address
    }
}

function je(e) {
    return et(e)
}

function et(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        daily_return: e.daily_return
    }
}

function tt(e) {
    return nt(e)
}

function nt(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        source: e.source,
        source_chain_id: e.source_chain_id,
        fast_bridge_tx_hash: e.fast_bridge_tx_hash,
        batch_claim_tx_hash: e.batch_claim_tx_hash,
        cctp_burn_tx_hash: e.cctp_burn_tx_hash,
        amount: e.amount,
        intent_address: e.intent_address,
        status: e.status,
        step: e.step,
        description: e.description,
        created_at: e.created_at,
        updated_at: e.updated_at,
        is_external_deposit: e.is_external_deposit,
        is_next_bridge_fast: e.is_next_bridge_fast
    }
}
const po = {
    Claimable: "claimable"
};

function it(e) {
    return at(e)
}

function at(e, t) {
    return e == null ? e : {
        id: e.id,
        asset_id: e.asset_id,
        amount: e.amount,
        timestamp: e.timestamp,
        status: e.status,
        l1_tx_hash: e.l1_tx_hash
    }
}

function rt(e) {
    return ot(e)
}

function ot(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        deposits: e.deposits.map(it),
        cursor: e.cursor
    }
}

function ut(e) {
    return ct(e)
}

function ct(e, t) {
    return e == null ? e : {
        unlock_timestamp: e.unlock_timestamp,
        asset_index: e.asset_index,
        amount: e.amount
    }
}

function lt(e) {
    return dt(e)
}

function dt(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        share_price: e.share_price
    }
}

function st(e) {
    return _t(e)
}

function _t(e, t) {
    return e == null ? e : {
        collateral: e.collateral
    }
}

function pt(e) {
    return mt(e)
}

function mt(e, t) {
    return e == null ? e : {
        status: e.status,
        operator_fee: e.operator_fee,
        min_operator_share_rate: e.min_operator_share_rate,
        total_shares: e.total_shares,
        operator_shares: e.operator_shares,
        annual_percentage_yield: e.annual_percentage_yield,
        sharpe_ratio: e.sharpe_ratio,
        daily_returns: e.daily_returns.map(je),
        share_prices: e.share_prices.map(lt),
        strategies: e.strategies.map(st)
    }
}

function B(e) {
    return ft(e)
}

function ft(e, t) {
    return e == null ? e : {
        public_pool_index: e.public_pool_index,
        shares_amount: e.shares_amount,
        entry_usdc: e.entry_usdc,
        principal_amount: e.principal_amount,
        entry_timestamp: e.entry_timestamp
    }
}

function ht(e) {
    return wt(e)
}

function wt(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        account_type: e.account_type,
        index: e.index,
        l1_address: e.l1_address,
        cancel_all_time: e.cancel_all_time,
        total_order_count: e.total_order_count,
        total_isolated_order_count: e.total_isolated_order_count,
        pending_order_count: e.pending_order_count,
        available_balance: e.available_balance,
        status: e.status,
        collateral: e.collateral,
        transaction_time: e.transaction_time,
        account_trading_mode: e.account_trading_mode == null ? void 0 : e.account_trading_mode,
        account_index: e.account_index,
        name: e.name,
        description: e.description,
        can_invite: e.can_invite,
        referral_points_percentage: e.referral_points_percentage,
        created_at: e.created_at,
        positions: e.positions.map(C),
        assets: e.assets.map(G),
        total_asset_value: e.total_asset_value,
        cross_asset_value: e.cross_asset_value,
        pool_info: pt(e.pool_info),
        shares: e.shares.map(B),
        pending_unlocks: e.pending_unlocks == null ? void 0 : e.pending_unlocks.map(ut)
    }
}

function gt(e) {
    return yt(e)
}

function yt(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        total: e.total,
        accounts: e.accounts.map(ht)
    }
}

function F(e) {
    return xt(e)
}

function xt(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        hash: e.hash,
        type: e.type,
        info: e.info,
        event_info: e.event_info,
        status: e.status,
        transaction_index: e.transaction_index,
        l1_address: e.l1_address,
        account_index: e.account_index,
        nonce: e.nonce,
        expire_at: e.expire_at,
        block_height: e.block_height,
        queued_at: e.queued_at,
        executed_at: e.executed_at,
        sequence_index: e.sequence_index,
        parent_hash: e.parent_hash,
        api_key_index: e.api_key_index,
        transaction_time: e.transaction_time,
        committed_at: e.committed_at,
        verified_at: e.verified_at
    }
}

function kt(e) {
    return bt(e)
}

function bt(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        data: e.data
    }
}

function St(e) {
    return Rt(e)
}

function Rt(e, t) {
    return e == null ? e : {
        symbol: e.symbol,
        last_trade_price: e.last_trade_price,
        daily_trades_count: e.daily_trades_count,
        daily_base_token_volume: e.daily_base_token_volume,
        daily_quote_token_volume: e.daily_quote_token_volume,
        daily_price_change: e.daily_price_change
    }
}

function Tt(e) {
    return Ot(e)
}

function Ot(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        total: e.total,
        order_book_stats: e.order_book_stats.map(St),
        daily_usd_volume: e.daily_usd_volume,
        daily_trades_count: e.daily_trades_count
    }
}

function Ft(e) {
    return vt(e)
}

function vt(e, t) {
    return e == null ? e : {
        exchange: e.exchange,
        market: e.market,
        size_usd: e.size_usd,
        avg_slippage: e.avg_slippage,
        data_count: e.data_count
    }
}

function Nt(e) {
    return Jt(e)
}

function Jt(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        slippage: e.slippage.map(Ft)
    }
}

function Dt(e) {
    return Lt(e)
}

function Lt(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        data_url: e.data_url
    }
}

function At(e) {
    return Et(e)
}

function Et(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        value: e.value,
        rate: e.rate,
        direction: e.direction
    }
}

function zt(e) {
    return It(e)
}

function It(e, t) {
    return e == null ? e : {
        market_id: e.market_id,
        exchange: e.exchange,
        symbol: e.symbol,
        rate: e.rate
    }
}

function Gt(e) {
    return Ct(e)
}

function Ct(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        funding_rates: e.funding_rates.map(zt)
    }
}

function Bt(e) {
    return Ut(e)
}

function Ut(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        resolution: e.resolution,
        fundings: e.fundings.map(At)
    }
}

function Mt(e) {
    return Ht(e)
}

function Ht(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        whitelisted: e.whitelisted,
        deposit_amount_left: e.deposit_amount_left
    }
}

function $t(e) {
    return Wt(e)
}

function Wt(e, t) {
    return e == null ? e : {
        l1_address: e.l1_address,
        can_invite: e.can_invite,
        referral_points_percentage: e.referral_points_percentage
    }
}

function Vt(e) {
    return Kt(e)
}

function Kt(e, t) {
    return e == null ? e : {
        chainId: e.chainId,
        networkId: e.networkId,
        latestBlockNumber: e.latestBlockNumber
    }
}

function Zt(e) {
    return Yt(e)
}

function Yt(e, t) {
    return e == null ? e : {
        address: e.address,
        is_active: e.is_active
    }
}

function Qt(e) {
    return Xt(e)
}

function Xt(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        l1_providers: e.l1_providers.map(Vt),
        l1_providers_health: e.l1_providers_health,
        validator_info: e.validator_info.map(Zt),
        contract_addresses: e.contract_addresses.map(Qe),
        latest_l1_generic_block: e.latest_l1_generic_block,
        latest_l1_governance_block: e.latest_l1_governance_block,
        latest_l1_desert_block: e.latest_l1_desert_block
    }
}

function qt(e) {
    return Pt(e)
}

function Pt(e, t) {
    return e == null ? e : {
        l1_address: e.l1_address,
        points: e.points,
        entry: e.entry,
        entryId: e.entryId,
        metadata: e.metadata
    }
}

function jt(e) {
    return en(e)
}

function en(e, t) {
    return e == null ? e : {
        entries: e.entries.map(qt)
    }
}
const mo = {
    WaitingFee: "waiting_fee",
    Leased: "leased",
    Expired: "expired",
    Canceled: "canceled"
};

function tn(e) {
    return nn(e)
}

function nn(e, t) {
    return e == null ? e : {
        id: e.id,
        master_account_index: e.master_account_index,
        lease_amount: e.lease_amount,
        fee_amount: e.fee_amount,
        start: e.start,
        end: e.end,
        status: e.status,
        error: e.error
    }
}

function an(e) {
    return rn(e)
}

function rn(e, t) {
    return e == null ? e : {
        duration_days: e.duration_days,
        annual_rate: e.annual_rate
    }
}

function on(e) {
    return un(e)
}

function un(e, t) {
    return e == null ? e : {
        price: e.price,
        size: e.size,
        taker_fee: e.taker_fee,
        maker_fee: e.maker_fee,
        transaction_time: e.transaction_time
    }
}

function v(e) {
    return cn(e)
}

function cn(e, t) {
    return e == null ? e : {
        market_id: e.market_id,
        collateral: e.collateral,
        total_account_value: e.total_account_value,
        initial_margin_req: e.initial_margin_req,
        maintenance_margin_req: e.maintenance_margin_req,
        close_out_margin_req: e.close_out_margin_req
    }
}

function N(e) {
    return ln(e)
}

function ln(e, t) {
    return e == null ? e : {
        cross_risk_parameters: v(e.cross_risk_parameters),
        isolated_risk_parameters: e.isolated_risk_parameters.map(v)
    }
}

function dn(e) {
    return sn(e)
}

function sn(e, t) {
    return e == null ? e : {
        positions: e.positions.map(C),
        risk_info_before: N(e.risk_info_before),
        risk_info_after: N(e.risk_info_after),
        mark_prices: e.mark_prices
    }
}
const fo = {
    Partial: "partial",
    Deleverage: "deleverage"
};

function _n(e) {
    return pn(e)
}

function pn(e, t) {
    return e == null ? e : {
        id: e.id,
        market_id: e.market_id,
        type: e.type,
        trade: on(e.trade),
        info: dn(e.info),
        executed_at: e.executed_at
    }
}

function mn(e) {
    return fn(e)
}

function fn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        liquidations: e.liquidations.map(_n),
        next_cursor: e.next_cursor == null ? void 0 : e.next_cursor
    }
}

function hn(e) {
    return wn(e)
}

function wn(e, t) {
    return e == null ? e : {
        market_margin_mode: e.market_margin_mode,
        insurance_fund_account_index: e.insurance_fund_account_index,
        liquidation_mode: e.liquidation_mode,
        force_reduce_only: e.force_reduce_only,
        trading_hours: e.trading_hours,
        funding_fee_discounts_enabled: e.funding_fee_discounts_enabled == null ? void 0 : e.funding_fee_discounts_enabled,
        hidden: e.hidden == null ? void 0 : e.hidden
    }
}

function gn(e) {
    return yn(e)
}

function yn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        nonce: e.nonce
    }
}
const ho = {
        Limit: "limit",
        Market: "market",
        StopLoss: "stop-loss",
        StopLossLimit: "stop-loss-limit",
        TakeProfit: "take-profit",
        TakeProfitLimit: "take-profit-limit",
        Twap: "twap",
        TwapSub: "twap-sub",
        Liquidation: "liquidation"
    },
    wo = {
        GoodTillTime: "good-till-time",
        ImmediateOrCancel: "immediate-or-cancel",
        PostOnly: "post-only",
        Unknown: "Unknown"
    },
    go = {
        InProgress: "in-progress",
        Pending: "pending",
        Open: "open",
        Filled: "filled",
        Canceled: "canceled",
        CanceledPostOnly: "canceled-post-only",
        CanceledReduceOnly: "canceled-reduce-only",
        CanceledPositionNotAllowed: "canceled-position-not-allowed",
        CanceledMarginNotAllowed: "canceled-margin-not-allowed",
        CanceledTooMuchSlippage: "canceled-too-much-slippage",
        CanceledNotEnoughLiquidity: "canceled-not-enough-liquidity",
        CanceledSelfTrade: "canceled-self-trade",
        CanceledExpired: "canceled-expired",
        CanceledOco: "canceled-oco",
        CanceledChild: "canceled-child",
        CanceledLiquidation: "canceled-liquidation",
        CanceledInvalidBalance: "canceled-invalid-balance"
    },
    yo = {
        Na: "na",
        Ready: "ready",
        MarkPrice: "mark-price",
        Twap: "twap",
        ParentOrder: "parent-order"
    };

function xn(e) {
    return kn(e)
}

function kn(e, t) {
    return e == null ? e : {
        order_index: e.order_index,
        client_order_index: e.client_order_index,
        order_id: e.order_id,
        client_order_id: e.client_order_id,
        market_index: e.market_index,
        owner_account_index: e.owner_account_index,
        initial_base_amount: e.initial_base_amount,
        price: e.price,
        nonce: e.nonce,
        remaining_base_amount: e.remaining_base_amount,
        is_ask: e.is_ask,
        base_size: e.base_size,
        base_price: e.base_price,
        filled_base_amount: e.filled_base_amount,
        filled_quote_amount: e.filled_quote_amount,
        side: e.side,
        type: e.type,
        time_in_force: e.time_in_force,
        reduce_only: e.reduce_only,
        trigger_price: e.trigger_price,
        order_expiry: e.order_expiry,
        status: e.status,
        trigger_status: e.trigger_status,
        trigger_time: e.trigger_time,
        parent_order_index: e.parent_order_index,
        parent_order_id: e.parent_order_id,
        to_trigger_order_id_0: e.to_trigger_order_id_0,
        to_trigger_order_id_1: e.to_trigger_order_id_1,
        to_cancel_order_id_0: e.to_cancel_order_id_0,
        block_height: e.block_height,
        timestamp: e.timestamp,
        created_at: e.created_at,
        updated_at: e.updated_at,
        transaction_time: e.transaction_time
    }
}

function bn(e) {
    return Sn(e)
}

function Sn(e, t) {
    return e == null ? e : {
        symbol: e.symbol,
        market_id: e.market_id,
        market_type: e.market_type,
        base_asset_id: e.base_asset_id,
        quote_asset_id: e.quote_asset_id,
        status: e.status,
        taker_fee: e.taker_fee,
        maker_fee: e.maker_fee,
        liquidation_fee: e.liquidation_fee,
        min_base_amount: e.min_base_amount,
        min_quote_amount: e.min_quote_amount,
        order_quote_limit: e.order_quote_limit,
        supported_size_decimals: e.supported_size_decimals,
        supported_price_decimals: e.supported_price_decimals,
        supported_quote_decimals: e.supported_quote_decimals
    }
}

function Rn(e) {
    return Tn(e)
}

function Tn(e, t) {
    return e == null ? e : {
        symbol: e.symbol,
        market_id: e.market_id,
        market_type: e.market_type,
        base_asset_id: e.base_asset_id,
        quote_asset_id: e.quote_asset_id,
        status: e.status,
        taker_fee: e.taker_fee,
        maker_fee: e.maker_fee,
        liquidation_fee: e.liquidation_fee,
        min_base_amount: e.min_base_amount,
        min_quote_amount: e.min_quote_amount,
        order_quote_limit: e.order_quote_limit,
        supported_size_decimals: e.supported_size_decimals,
        supported_price_decimals: e.supported_price_decimals,
        supported_quote_decimals: e.supported_quote_decimals,
        size_decimals: e.size_decimals,
        price_decimals: e.price_decimals,
        last_trade_price: e.last_trade_price,
        daily_trades_count: e.daily_trades_count,
        daily_base_token_volume: e.daily_base_token_volume,
        daily_quote_token_volume: e.daily_quote_token_volume,
        daily_price_low: e.daily_price_low,
        daily_price_high: e.daily_price_high,
        daily_price_change: e.daily_price_change,
        daily_chart: e.daily_chart
    }
}

function On(e) {
    return Fn(e)
}

function Fn(e, t) {
    return e == null ? e : {
        symbol: e.symbol,
        market_id: e.market_id,
        market_type: e.market_type,
        base_asset_id: e.base_asset_id,
        quote_asset_id: e.quote_asset_id,
        status: e.status,
        taker_fee: e.taker_fee,
        maker_fee: e.maker_fee,
        liquidation_fee: e.liquidation_fee,
        min_base_amount: e.min_base_amount,
        min_quote_amount: e.min_quote_amount,
        order_quote_limit: e.order_quote_limit,
        supported_size_decimals: e.supported_size_decimals,
        supported_price_decimals: e.supported_price_decimals,
        supported_quote_decimals: e.supported_quote_decimals,
        size_decimals: e.size_decimals,
        price_decimals: e.price_decimals,
        quote_multiplier: e.quote_multiplier,
        default_initial_margin_fraction: e.default_initial_margin_fraction,
        min_initial_margin_fraction: e.min_initial_margin_fraction,
        maintenance_margin_fraction: e.maintenance_margin_fraction,
        closeout_margin_fraction: e.closeout_margin_fraction,
        last_trade_price: e.last_trade_price,
        daily_trades_count: e.daily_trades_count,
        daily_base_token_volume: e.daily_base_token_volume,
        daily_quote_token_volume: e.daily_quote_token_volume,
        daily_price_low: e.daily_price_low,
        daily_price_high: e.daily_price_high,
        daily_price_change: e.daily_price_change,
        open_interest: e.open_interest,
        daily_chart: e.daily_chart,
        market_config: hn(e.market_config),
        strategy_index: e.strategy_index
    }
}

function vn(e) {
    return Nn(e)
}

function Nn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        order_book_details: e.order_book_details.map(On),
        spot_order_book_details: e.spot_order_book_details.map(Rn)
    }
}

function J(e) {
    return Jn(e)
}

function Jn(e, t) {
    return e == null ? e : {
        order_index: e.order_index,
        order_id: e.order_id,
        owner_account_index: e.owner_account_index,
        initial_base_amount: e.initial_base_amount,
        remaining_base_amount: e.remaining_base_amount,
        price: e.price,
        order_expiry: e.order_expiry,
        transaction_time: e.transaction_time
    }
}

function Dn(e) {
    return Ln(e)
}

function Ln(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        total_asks: e.total_asks,
        asks: e.asks.map(J),
        total_bids: e.total_bids,
        bids: e.bids.map(J)
    }
}

function An(e) {
    return En(e)
}

function En(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        order_books: e.order_books.map(bn)
    }
}

function D(e) {
    return zn(e)
}

function zn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        next_cursor: e.next_cursor == null ? void 0 : e.next_cursor,
        orders: e.orders.map(xn)
    }
}
const xo = {
    Long: "long",
    Short: "short"
};

function In(e) {
    return Gn(e)
}

function Gn(e, t) {
    return e == null ? e : {
        timestamp: e.timestamp,
        market_id: e.market_id,
        funding_id: e.funding_id,
        change: e.change,
        rate: e.rate,
        position_size: e.position_size,
        position_side: e.position_side,
        discount: e.discount
    }
}

function Cn(e) {
    return Bn(e)
}

function Bn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        position_fundings: e.position_fundings.map(In),
        next_cursor: e.next_cursor == null ? void 0 : e.next_cursor
    }
}

function Un(e) {
    return Mn(e)
}

function Mn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        account_index: e.account_index,
        created_at: e.created_at,
        master_account_index: e.master_account_index,
        account_type: e.account_type,
        name: e.name,
        l1_address: e.l1_address,
        annual_percentage_yield: e.annual_percentage_yield,
        sharpe_ratio: e.sharpe_ratio,
        status: e.status,
        operator_fee: e.operator_fee,
        total_asset_value: e.total_asset_value,
        total_spot_value: e.total_spot_value,
        total_perps_value: e.total_perps_value,
        total_shares: e.total_shares,
        account_share: e.account_share == null ? void 0 : B(e.account_share),
        assets: e.assets.map(G)
    }
}

function Hn(e) {
    return $n(e)
}

function $n(e, t) {
    return e == null ? e : {
        l1_address: e.l1_address,
        referral_code: e.referral_code,
        used_at: e.used_at
    }
}

function L(e) {
    return Wn(e)
}

function Wn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        referral_code: e.referral_code,
        remaining_usage: e.remaining_usage
    }
}

function Vn(e) {
    return Kn(e)
}

function Kn(e, t) {
    return e == null ? e : {
        l1_address: e.l1_address,
        total_points: e.total_points,
        week_points: e.week_points,
        total_reward_points: e.total_reward_points,
        week_reward_points: e.week_reward_points,
        reward_point_multiplier: e.reward_point_multiplier
    }
}

function Zn(e) {
    return Yn(e)
}

function Yn(e, t) {
    return e == null ? e : {
        referrals: e.referrals.map(Vn),
        user_total_points: e.user_total_points,
        user_last_week_points: e.user_last_week_points,
        user_total_referral_reward_points: e.user_total_referral_reward_points,
        user_last_week_referral_reward_points: e.user_last_week_referral_reward_points,
        reward_point_multiplier: e.reward_point_multiplier
    }
}

function Qn(e) {
    return Xn(e)
}

function Xn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message
    }
}

function qn(e) {
    return Pn(e)
}

function Pn(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        api_tokens: e.api_tokens.map(Fe)
    }
}

function jn(e) {
    return ei(e)
}

function ei(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        bridges: e.bridges.map(ze)
    }
}

function ti(e) {
    return ni(e)
}

function ni(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        metrics: e.metrics.map(kt)
    }
}

function ii(e) {
    return ai(e)
}

function ai(e, t) {
    return e == null ? e : {
        period: e.period,
        result: e.result.map(Nt)
    }
}

function ri(e) {
    return oi(e)
}

function oi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        fast_bridge_limit: e.fast_bridge_limit
    }
}

function ui(e) {
    return ci(e)
}

function ci(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        to_account_index: e.to_account_index,
        withdraw_limit: e.withdraw_limit,
        max_withdrawal_amount: e.max_withdrawal_amount
    }
}

function li(e) {
    return di(e)
}

function di(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        is_next_bridge_fast: e.is_next_bridge_fast
    }
}

function si(e) {
    return _i(e)
}

function _i(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        options: e.options.map(an),
        lit_incentives_account_index: e.lit_incentives_account_index
    }
}

function pi(e) {
    return mi(e)
}

function mi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        leases: e.leases.map(tn),
        next_cursor: e.next_cursor == null ? void 0 : e.next_cursor
    }
}

function fi(e) {
    return hi(e)
}

function hi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        token_id: e.token_id,
        api_token: e.api_token,
        name: e.name,
        account_index: e.account_index,
        expiry: e.expiry,
        sub_account_access: e.sub_account_access,
        revoked: e.revoked,
        scopes: e.scopes
    }
}

function wi(e) {
    return gi(e)
}

function gi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        public_pools: e.public_pools.map(Un)
    }
}

function yi(e) {
    return xi(e)
}

function xi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        token_id: e.token_id,
        revoked: e.revoked
    }
}

function ki(e) {
    return bi(e)
}

function bi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        tx_hash: e.tx_hash,
        predicted_execution_time_ms: e.predicted_execution_time_ms,
        volume_quota_remaining: e.volume_quota_remaining
    }
}

function Si(e) {
    return Ri(e)
}

function Ri(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        tx_hash: e.tx_hash,
        predicted_execution_time_ms: e.predicted_execution_time_ms,
        volume_quota_remaining: e.volume_quota_remaining
    }
}

function Ti(e) {
    return Oi(e)
}

function Oi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        success: e.success
    }
}

function Fi(e) {
    return vi(e)
}

function vi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        success: e.success
    }
}

function Ni(e) {
    return Ji(e)
}

function Ji(e, t) {
    return e == null ? e : {
        seconds: e.seconds
    }
}

function h(e) {
    return Di(e)
}

function Di(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message
    }
}

function Li(e) {
    return Ai(e)
}

function Ai(e, t) {
    return e == null ? e : {
        status: e.status,
        network_id: e.network_id,
        timestamp: e.timestamp
    }
}

function Ei(e) {
    return zi(e)
}

function zi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        l1_address: e.l1_address,
        sub_accounts: e.sub_accounts.map(te)
    }
}

function Ii(e) {
    return Gi(e)
}

function Gi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        liquidity_pool_index: e.liquidity_pool_index,
        staking_pool_index: e.staking_pool_index,
        funding_fee_rebate_account_index: e.funding_fee_rebate_account_index,
        liquidity_pool_cooldown_period: e.liquidity_pool_cooldown_period,
        staking_pool_lockup_period: e.staking_pool_lockup_period
    }
}
const ko = {
    Trade: "trade",
    Liquidation: "liquidation",
    Deleverage: "deleverage",
    MarketSettlement: "market-settlement"
};

function Ci(e) {
    return Bi(e)
}

function Bi(e, t) {
    return e == null ? e : {
        trade_id: e.trade_id,
        tx_hash: e.tx_hash,
        type: e.type,
        market_id: e.market_id,
        size: e.size,
        price: e.price,
        usd_amount: e.usd_amount,
        ask_id: e.ask_id,
        bid_id: e.bid_id,
        ask_client_id: e.ask_client_id,
        bid_client_id: e.bid_client_id,
        ask_account_id: e.ask_account_id,
        bid_account_id: e.bid_account_id,
        is_maker_ask: e.is_maker_ask,
        block_height: e.block_height,
        timestamp: e.timestamp,
        taker_fee: e.taker_fee == null ? void 0 : e.taker_fee,
        taker_position_size_before: e.taker_position_size_before,
        taker_entry_quote_before: e.taker_entry_quote_before,
        taker_initial_margin_fraction_before: e.taker_initial_margin_fraction_before,
        taker_position_sign_changed: e.taker_position_sign_changed,
        maker_fee: e.maker_fee == null ? void 0 : e.maker_fee,
        maker_position_size_before: e.maker_position_size_before,
        maker_entry_quote_before: e.maker_entry_quote_before,
        maker_initial_margin_fraction_before: e.maker_initial_margin_fraction_before,
        maker_position_sign_changed: e.maker_position_sign_changed,
        transaction_time: e.transaction_time,
        ask_account_pnl: e.ask_account_pnl,
        bid_account_pnl: e.bid_account_pnl
    }
}

function A(e) {
    return Ui(e)
}

function Ui(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        next_cursor: e.next_cursor == null ? void 0 : e.next_cursor,
        trades: e.trades.map(Ci)
    }
}

function Mi(e) {
    return Hi(e)
}

function Hi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        transfer_fee_usdc: e.transfer_fee_usdc
    }
}
const bo = {
    L2TransferInflow: "L2TransferInflow",
    L2TransferOutflow: "L2TransferOutflow",
    L2BurnSharesInflow: "L2BurnSharesInflow",
    L2BurnSharesOutflow: "L2BurnSharesOutflow",
    L2MintSharesInflow: "L2MintSharesInflow",
    L2MintSharesOutflow: "L2MintSharesOutflow",
    L2SelfTransfer: "L2SelfTransfer",
    L2StakeAssetInflow: "L2StakeAssetInflow",
    L2StakeAssetOutflow: "L2StakeAssetOutflow",
    L2UnstakeAssetInflow: "L2UnstakeAssetInflow",
    L2UnstakeAssetOutflow: "L2UnstakeAssetOutflow",
    L2ForceBurnSharesInflow: "L2ForceBurnSharesInflow",
    L2ForceBurnSharesOutflow: "L2ForceBurnSharesOutflow"
};

function $i(e) {
    return Wi(e)
}

function Wi(e, t) {
    return e == null ? e : {
        id: e.id,
        asset_id: e.asset_id,
        amount: e.amount,
        fee: e.fee,
        timestamp: e.timestamp,
        type: e.type,
        from_l1_address: e.from_l1_address,
        to_l1_address: e.to_l1_address,
        from_account_index: e.from_account_index,
        to_account_index: e.to_account_index,
        from_route: e.from_route,
        to_route: e.to_route,
        tx_hash: e.tx_hash
    }
}

function Vi(e) {
    return Ki(e)
}

function Ki(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        transfers: e.transfers.map($i),
        cursor: e.cursor
    }
}

function Zi(e) {
    return Yi(e)
}

function Yi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        tx_hash: e.tx_hash
    }
}

function k(e) {
    return Qi(e)
}

function Qi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        txs: e.txs.map(Ae)
    }
}

function Xi(e) {
    return qi(e)
}

function qi(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        cursor: e.cursor,
        referrals: e.referrals.map(Hn)
    }
}
const So = {
        Claimable: "claimable",
        Refunded: "refunded"
    },
    Ro = {
        Secure: "secure",
        Fast: "fast"
    };

function Pi(e) {
    return ji(e)
}

function ji(e, t) {
    return e == null ? e : {
        id: e.id,
        asset_id: e.asset_id,
        amount: e.amount,
        timestamp: e.timestamp,
        status: e.status,
        type: e.type,
        l1_tx_hash: e.l1_tx_hash
    }
}

function ea(e) {
    return ta(e)
}

function ta(e, t) {
    return e == null ? e : {
        code: e.code,
        message: e.message == null ? void 0 : e.message,
        withdraws: e.withdraws.map(Pi),
        cursor: e.cursor
    }
}

function na(e) {
    return ia(e)
}

function ia(e, t) {
    return e == null ? e : {
        contract_address: e.contract_address
    }
}
let To = class extends p {
    async accountRaw(t, i) {
        if (t.by == null) throw new u("by", 'Required parameter "by" was null or undefined when calling account().');
        if (t.value == null) throw new u("value", 'Required parameter "value" was null or undefined when calling account().');
        const n = {};
        t.by != null && (n.by = t.by), t.value != null && (n.value = t.value);
        const a = {},
            o = await this.request({
                path: "/api/v1/account",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => gt(r))
    }
    async account(t, i) {
        return await (await this.accountRaw(t, i)).value()
    }
    async accountLimitsRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling accountLimits().');
        const n = {};
        t.account_index != null && (n.account_index = t.account_index), t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth);
        const a = {},
            o = await this.request({
                path: "/api/v1/accountLimits",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => ce(r))
    }
    async accountLimits(t, i) {
        return await (await this.accountLimitsRaw(t, i)).value()
    }
    async accountMetadataRaw(t, i) {
        if (t.by == null) throw new u("by", 'Required parameter "by" was null or undefined when calling accountMetadata().');
        if (t.value == null) throw new u("value", 'Required parameter "value" was null or undefined when calling accountMetadata().');
        const n = {};
        t.by != null && (n.by = t.by), t.value != null && (n.value = t.value), t.auth != null && (n.auth = t.auth);
        const a = {};
        t.authorization != null && (a.authorization = String(t.authorization));
        const o = await this.request({
            path: "/api/v1/accountMetadata",
            method: "GET",
            headers: a,
            query: n
        }, i);
        return new c(o, r => _e(r))
    }
    async accountMetadata(t, i) {
        return await (await this.accountMetadataRaw(t, i)).value()
    }
    async accountsByL1AddressRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling accountsByL1Address().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address);
        const a = {},
            o = await this.request({
                path: "/api/v1/accountsByL1Address",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Ei(r))
    }
    async accountsByL1Address(t, i) {
        return await (await this.accountsByL1AddressRaw(t, i)).value()
    }
    async airdropRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling airdrop().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address), t.auth != null && (n.auth = t.auth);
        const a = {};
        t.authorization != null && (a.authorization = String(t.authorization));
        const o = await this.request({
            path: "/api/v1/airdrop",
            method: "GET",
            headers: a,
            query: n
        }, i);
        return new c(o, r => ke(r))
    }
    async airdrop(t, i) {
        return await (await this.airdropRaw(t, i)).value()
    }
    async airdropCreateRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling airdropCreate().');
        if (t.allocations == null) throw new u("allocations", 'Required parameter "allocations" was null or undefined when calling airdropCreate().');
        if (t.signature == null) throw new u("signature", 'Required parameter "signature" was null or undefined when calling airdropCreate().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.l1_address != null && r.append("l1_address", t.l1_address), t.allocations != null && r.append("allocations", t.allocations), t.signature != null && r.append("signature", t.signature), t.auth != null && r.append("auth", t.auth);
        const l = await this.request({
            path: "/api/v1/airdrop/create",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => h(d))
    }
    async airdropCreate(t, i) {
        return await (await this.airdropCreateRaw(t, i)).value()
    }
    async apikeysRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling apikeys().');
        const n = {};
        t.account_index != null && (n.account_index = t.account_index), t.api_key_index != null && (n.api_key_index = t.api_key_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/apikeys",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => re(r))
    }
    async apikeys(t, i) {
        return await (await this.apikeysRaw(t, i)).value()
    }
    async changeAccountTierRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling changeAccountTier().');
        if (t.new_tier == null) throw new u("new_tier", 'Required parameter "new_tier" was null or undefined when calling changeAccountTier().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.auth != null && r.append("auth", t.auth), t.account_index != null && r.append("account_index", t.account_index), t.new_tier != null && r.append("new_tier", t.new_tier);
        const l = await this.request({
            path: "/api/v1/changeAccountTier",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => Qn(d))
    }
    async changeAccountTier(t, i) {
        return await (await this.changeAccountTierRaw(t, i)).value()
    }
    async faucetRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling faucet().');
        if (t.do_l1_transfer == null) throw new u("do_l1_transfer", 'Required parameter "do_l1_transfer" was null or undefined when calling faucet().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address), t.do_l1_transfer != null && (n.do_l1_transfer = t.do_l1_transfer);
        const a = {},
            o = await this.request({
                path: "/api/v1/faucet",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => h(r))
    }
    async faucet(t, i) {
        return await (await this.faucetRaw(t, i)).value()
    }
    async isWhitelistedRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling isWhitelisted().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address);
        const a = {},
            o = await this.request({
                path: "/api/v1/isWhitelisted",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Mt(r))
    }
    async isWhitelisted(t, i) {
        return await (await this.isWhitelistedRaw(t, i)).value()
    }
    async l1MetadataRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling l1Metadata().');
        const n = {};
        t.auth != null && (n.auth = t.auth), t.l1_address != null && (n.l1_address = t.l1_address);
        const a = {};
        t.authorization != null && (a.authorization = String(t.authorization));
        const o = await this.request({
            path: "/api/v1/l1Metadata",
            method: "GET",
            headers: a,
            query: n
        }, i);
        return new c(o, r => $t(r))
    }
    async l1Metadata(t, i) {
        return await (await this.l1MetadataRaw(t, i)).value()
    }
    async leaderboardRaw(t, i) {
        if (t.type == null) throw new u("type", 'Required parameter "type" was null or undefined when calling leaderboard().');
        const n = {};
        t.type != null && (n.type = t.type), t.l1_address != null && (n.l1_address = t.l1_address), t.competition_id != null && (n.competition_id = t.competition_id), t.auth != null && (n.auth = t.auth);
        const a = {};
        t.authorization != null && (a.authorization = String(t.authorization));
        const o = await this.request({
            path: "/api/v1/leaderboard",
            method: "GET",
            headers: a,
            query: n
        }, i);
        return new c(o, r => jt(r))
    }
    async leaderboard(t, i) {
        return await (await this.leaderboardRaw(t, i)).value()
    }
    async leaseOptionsRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/leaseOptions",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => si(o))
    }
    async leaseOptions(t) {
        return await (await this.leaseOptionsRaw(t)).value()
    }
    async leasesRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling leases().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.cursor != null && (n.cursor = t.cursor), t.limit != null && (n.limit = t.limit);
        const a = {},
            o = await this.request({
                path: "/api/v1/leases",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => pi(r))
    }
    async leases(t, i) {
        return await (await this.leasesRaw(t, i)).value()
    }
    async liquidationsRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling liquidations().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling liquidations().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.market_id != null && (n.market_id = t.market_id), t.cursor != null && (n.cursor = t.cursor), t.limit != null && (n.limit = t.limit);
        const a = {},
            o = await this.request({
                path: "/api/v1/liquidations",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => mn(r))
    }
    async liquidations(t, i) {
        return await (await this.liquidationsRaw(t, i)).value()
    }
    async litLeaseRaw(t, i) {
        if (t.tx_info == null) throw new u("tx_info", 'Required parameter "tx_info" was null or undefined when calling litLease().');
        if (t.lease_amount == null) throw new u("lease_amount", 'Required parameter "lease_amount" was null or undefined when calling litLease().');
        if (t.duration_days == null) throw new u("duration_days", 'Required parameter "duration_days" was null or undefined when calling litLease().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.tx_info != null && r.append("tx_info", t.tx_info), t.lease_amount != null && r.append("lease_amount", t.lease_amount), t.duration_days != null && r.append("duration_days", t.duration_days);
        const l = await this.request({
            path: "/api/v1/litLease",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => Zi(d))
    }
    async litLease(t, i) {
        return await (await this.litLeaseRaw(t, i)).value()
    }
    async pnlRaw(t, i) {
        if (t.by == null) throw new u("by", 'Required parameter "by" was null or undefined when calling pnl().');
        if (t.value == null) throw new u("value", 'Required parameter "value" was null or undefined when calling pnl().');
        if (t.resolution == null) throw new u("resolution", 'Required parameter "resolution" was null or undefined when calling pnl().');
        if (t.start_timestamp == null) throw new u("start_timestamp", 'Required parameter "start_timestamp" was null or undefined when calling pnl().');
        if (t.end_timestamp == null) throw new u("end_timestamp", 'Required parameter "end_timestamp" was null or undefined when calling pnl().');
        if (t.count_back == null) throw new u("count_back", 'Required parameter "count_back" was null or undefined when calling pnl().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.by != null && (n.by = t.by), t.value != null && (n.value = t.value), t.resolution != null && (n.resolution = t.resolution), t.start_timestamp != null && (n.start_timestamp = t.start_timestamp), t.end_timestamp != null && (n.end_timestamp = t.end_timestamp), t.count_back != null && (n.count_back = t.count_back), t.ignore_transfers != null && (n.ignore_transfers = t.ignore_transfers);
        const a = {},
            o = await this.request({
                path: "/api/v1/pnl",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => he(r))
    }
    async pnl(t, i) {
        return await (await this.pnlRaw(t, i)).value()
    }
    async positionFundingRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling positionFunding().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling positionFunding().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.market_id != null && (n.market_id = t.market_id), t.cursor != null && (n.cursor = t.cursor), t.limit != null && (n.limit = t.limit), t.side != null && (n.side = t.side);
        const a = {},
            o = await this.request({
                path: "/api/v1/positionFunding",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Cn(r))
    }
    async positionFunding(t, i) {
        return await (await this.positionFundingRaw(t, i)).value()
    }
    async publicPoolsMetadataRaw(t, i) {
        if (t.index == null) throw new u("index", 'Required parameter "index" was null or undefined when calling publicPoolsMetadata().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling publicPoolsMetadata().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.filter != null && (n.filter = t.filter), t.index != null && (n.index = t.index), t.limit != null && (n.limit = t.limit), t.account_index != null && (n.account_index = t.account_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/publicPoolsMetadata",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => wi(r))
    }
    async publicPoolsMetadata(t, i) {
        return await (await this.publicPoolsMetadataRaw(t, i)).value()
    }
    async tokensRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling tokens().');
        const n = {};
        t.account_index != null && (n.account_index = t.account_index);
        const a = {};
        t.authorization != null && (a.authorization = String(t.authorization));
        const o = await this.request({
            path: "/api/v1/tokens",
            method: "GET",
            headers: a,
            query: n
        }, i);
        return new c(o, r => qn(r))
    }
    async tokens(t, i) {
        return await (await this.tokensRaw(t, i)).value()
    }
    async tokensCreateRaw(t, i) {
        if (t.name == null) throw new u("name", 'Required parameter "name" was null or undefined when calling tokensCreate().');
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling tokensCreate().');
        if (t.expiry == null) throw new u("expiry", 'Required parameter "expiry" was null or undefined when calling tokensCreate().');
        if (t.sub_account_access == null) throw new u("sub_account_access", 'Required parameter "sub_account_access" was null or undefined when calling tokensCreate().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.name != null && r.append("name", t.name), t.account_index != null && r.append("account_index", t.account_index), t.expiry != null && r.append("expiry", t.expiry), t.sub_account_access != null && r.append("sub_account_access", t.sub_account_access), t.scopes != null && r.append("scopes", t.scopes);
        const l = await this.request({
            path: "/api/v1/tokens/create",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => fi(d))
    }
    async tokensCreate(t, i) {
        return await (await this.tokensCreateRaw(t, i)).value()
    }
    async tokensRevokeRaw(t, i) {
        if (t.token_id == null) throw new u("token_id", 'Required parameter "token_id" was null or undefined when calling tokensRevoke().');
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling tokensRevoke().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.token_id != null && r.append("token_id", t.token_id), t.account_index != null && r.append("account_index", t.account_index);
        const l = await this.request({
            path: "/api/v1/tokens/revoke",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => yi(d))
    }
    async tokensRevoke(t, i) {
        return await (await this.tokensRevokeRaw(t, i)).value()
    }
};
const Fo = {
    Long: "long",
    Short: "short",
    All: "all"
};
class vo extends p {
    async announcementRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/announcement",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Te(o))
    }
    async announcement(t) {
        return await (await this.announcementRaw(t)).value()
    }
}
class No extends p {
    async bridgesRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling bridges().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address);
        const a = {},
            o = await this.request({
                path: "/api/v1/bridges",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => jn(r))
    }
    async bridges(t, i) {
        return await (await this.bridgesRaw(t, i)).value()
    }
    async bridgesIsNextBridgeFastRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling bridgesIsNextBridgeFast().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address);
        const a = {},
            o = await this.request({
                path: "/api/v1/bridges/isNextBridgeFast",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => li(r))
    }
    async bridgesIsNextBridgeFast(t, i) {
        return await (await this.bridgesIsNextBridgeFastRaw(t, i)).value()
    }
    async createIntentAddressRaw(t, i) {
        if (t.chain_id == null) throw new u("chain_id", 'Required parameter "chain_id" was null or undefined when calling createIntentAddress().');
        if (t.from_addr == null) throw new u("from_addr", 'Required parameter "from_addr" was null or undefined when calling createIntentAddress().');
        if (t.amount == null) throw new u("amount", 'Required parameter "amount" was null or undefined when calling createIntentAddress().');
        const n = {},
            a = {};
        s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.chain_id != null && r.append("chain_id", t.chain_id), t.from_addr != null && r.append("from_addr", t.from_addr), t.amount != null && r.append("amount", t.amount), t.is_external_deposit != null && r.append("is_external_deposit", t.is_external_deposit);
        const l = await this.request({
            path: "/api/v1/createIntentAddress",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => qe(d))
    }
    async createIntentAddress(t, i) {
        return await (await this.createIntentAddressRaw(t, i)).value()
    }
    async depositLatestRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling depositLatest().');
        const n = {};
        t.l1_address != null && (n.l1_address = t.l1_address);
        const a = {},
            o = await this.request({
                path: "/api/v1/deposit/latest",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => tt(r))
    }
    async depositLatest(t, i) {
        return await (await this.depositLatestRaw(t, i)).value()
    }
    async depositNetworksRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/deposit/networks",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Be(o))
    }
    async depositNetworks(t) {
        return await (await this.depositNetworksRaw(t)).value()
    }
    async fastbridgeInfoRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/fastbridge/info",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => ri(o))
    }
    async fastbridgeInfo(t) {
        return await (await this.fastbridgeInfoRaw(t)).value()
    }
    async fastwithdrawRaw(t, i) {
        if (t.tx_info == null) throw new u("tx_info", 'Required parameter "tx_info" was null or undefined when calling fastwithdraw().');
        if (t.to_address == null) throw new u("to_address", 'Required parameter "to_address" was null or undefined when calling fastwithdraw().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.tx_info != null && r.append("tx_info", t.tx_info), t.to_address != null && r.append("to_address", t.to_address), t.auth != null && r.append("auth", t.auth);
        const l = await this.request({
            path: "/api/v1/fastwithdraw",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => h(d))
    }
    async fastwithdraw(t, i) {
        return await (await this.fastwithdrawRaw(t, i)).value()
    }
    async fastwithdrawInfoRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling fastwithdrawInfo().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/fastwithdraw/info",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => ui(r))
    }
    async fastwithdrawInfo(t, i) {
        return await (await this.fastwithdrawInfoRaw(t, i)).value()
    }
}
class Jo extends p {
    async candlesRaw(t, i) {
        if (t.market_id == null) throw new u("market_id", 'Required parameter "market_id" was null or undefined when calling candles().');
        if (t.resolution == null) throw new u("resolution", 'Required parameter "resolution" was null or undefined when calling candles().');
        if (t.start_timestamp == null) throw new u("start_timestamp", 'Required parameter "start_timestamp" was null or undefined when calling candles().');
        if (t.end_timestamp == null) throw new u("end_timestamp", 'Required parameter "end_timestamp" was null or undefined when calling candles().');
        if (t.count_back == null) throw new u("count_back", 'Required parameter "count_back" was null or undefined when calling candles().');
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.resolution != null && (n.resolution = t.resolution), t.start_timestamp != null && (n.start_timestamp = t.start_timestamp), t.end_timestamp != null && (n.end_timestamp = t.end_timestamp), t.count_back != null && (n.count_back = t.count_back), t.set_timestamp_to_end != null && (n.set_timestamp_to_end = t.set_timestamp_to_end);
        const a = {},
            o = await this.request({
                path: "/api/v1/candles",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => $e(r))
    }
    async candles(t, i) {
        return await (await this.candlesRaw(t, i)).value()
    }
    async candlesticksRaw(t, i) {
        if (t.market_id == null) throw new u("market_id", 'Required parameter "market_id" was null or undefined when calling candlesticks().');
        if (t.resolution == null) throw new u("resolution", 'Required parameter "resolution" was null or undefined when calling candlesticks().');
        if (t.start_timestamp == null) throw new u("start_timestamp", 'Required parameter "start_timestamp" was null or undefined when calling candlesticks().');
        if (t.end_timestamp == null) throw new u("end_timestamp", 'Required parameter "end_timestamp" was null or undefined when calling candlesticks().');
        if (t.count_back == null) throw new u("count_back", 'Required parameter "count_back" was null or undefined when calling candlesticks().');
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.resolution != null && (n.resolution = t.resolution), t.start_timestamp != null && (n.start_timestamp = t.start_timestamp), t.end_timestamp != null && (n.end_timestamp = t.end_timestamp), t.count_back != null && (n.count_back = t.count_back), t.set_timestamp_to_end != null && (n.set_timestamp_to_end = t.set_timestamp_to_end);
        const a = {},
            o = await this.request({
                path: "/api/v1/candlesticks",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Ze(r))
    }
    async candlesticks(t, i) {
        return await (await this.candlesticksRaw(t, i)).value()
    }
    async fundingsRaw(t, i) {
        if (t.market_id == null) throw new u("market_id", 'Required parameter "market_id" was null or undefined when calling fundings().');
        if (t.resolution == null) throw new u("resolution", 'Required parameter "resolution" was null or undefined when calling fundings().');
        if (t.start_timestamp == null) throw new u("start_timestamp", 'Required parameter "start_timestamp" was null or undefined when calling fundings().');
        if (t.end_timestamp == null) throw new u("end_timestamp", 'Required parameter "end_timestamp" was null or undefined when calling fundings().');
        if (t.count_back == null) throw new u("count_back", 'Required parameter "count_back" was null or undefined when calling fundings().');
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.resolution != null && (n.resolution = t.resolution), t.start_timestamp != null && (n.start_timestamp = t.start_timestamp), t.end_timestamp != null && (n.end_timestamp = t.end_timestamp), t.count_back != null && (n.count_back = t.count_back);
        const a = {},
            o = await this.request({
                path: "/api/v1/fundings",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Bt(r))
    }
    async fundings(t, i) {
        return await (await this.fundingsRaw(t, i)).value()
    }
}
class Do extends p {
    async fundingRatesRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/funding-rates",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Gt(o))
    }
    async fundingRates(t) {
        return await (await this.fundingRatesRaw(t)).value()
    }
}
class Lo extends p {
    async geoLocationRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/geoLocation",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => h(o))
    }
    async geoLocation(t) {
        return await (await this.geoLocationRaw(t)).value()
    }
}
class Ao extends p {
    async layer1BasicInfoRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/layer1BasicInfo",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Qt(o))
    }
    async layer1BasicInfo(t) {
        return await (await this.layer1BasicInfoRaw(t)).value()
    }
    async systemConfigRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/systemConfig",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Ii(o))
    }
    async systemConfig(t) {
        return await (await this.systemConfigRaw(t)).value()
    }
    async transferFeeInfoRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling transferFeeInfo().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.to_account_index != null && (n.to_account_index = t.to_account_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/transferFeeInfo",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Mi(r))
    }
    async transferFeeInfo(t, i) {
        return await (await this.transferFeeInfoRaw(t, i)).value()
    }
    async withdrawalDelayRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/withdrawalDelay",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Ni(o))
    }
    async withdrawalDelay(t) {
        return await (await this.withdrawalDelayRaw(t)).value()
    }
}
class Eo extends p {
    async notificationAckRaw(t, i) {
        if (t.notif_id == null) throw new u("notif_id", 'Required parameter "notif_id" was null or undefined when calling notificationAck().');
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling notificationAck().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.notif_id != null && r.append("notif_id", t.notif_id), t.auth != null && r.append("auth", t.auth), t.account_index != null && r.append("account_index", t.account_index);
        const l = await this.request({
            path: "/api/v1/notification/ack",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => h(d))
    }
    async notificationAck(t, i) {
        return await (await this.notificationAckRaw(t, i)).value()
    }
}
class zo extends p {
    async _exportRaw(t, i) {
        if (t.type == null) throw new u("type", 'Required parameter "type" was null or undefined when calling _export().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.market_id != null && (n.market_id = t.market_id), t.type != null && (n.type = t.type), t.start_timestamp != null && (n.start_timestamp = t.start_timestamp), t.end_timestamp != null && (n.end_timestamp = t.end_timestamp), t.side != null && (n.side = t.side), t.role != null && (n.role = t.role), t.trade_type != null && (n.trade_type = t.trade_type);
        const a = {},
            o = await this.request({
                path: "/api/v1/export",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Dt(r))
    }
    async _export(t, i) {
        return await (await this._exportRaw(t, i)).value()
    }
    async accountActiveOrdersRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling accountActiveOrders().');
        if (t.market_id == null) throw new u("market_id", 'Required parameter "market_id" was null or undefined when calling accountActiveOrders().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.market_id != null && (n.market_id = t.market_id);
        const a = {},
            o = await this.request({
                path: "/api/v1/accountActiveOrders",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => D(r))
    }
    async accountActiveOrders(t, i) {
        return await (await this.accountActiveOrdersRaw(t, i)).value()
    }
    async accountInactiveOrdersRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling accountInactiveOrders().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling accountInactiveOrders().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.market_id != null && (n.market_id = t.market_id), t.ask_filter != null && (n.ask_filter = t.ask_filter), t.between_timestamps != null && (n.between_timestamps = t.between_timestamps), t.cursor != null && (n.cursor = t.cursor), t.limit != null && (n.limit = t.limit);
        const a = {},
            o = await this.request({
                path: "/api/v1/accountInactiveOrders",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => D(r))
    }
    async accountInactiveOrders(t, i) {
        return await (await this.accountInactiveOrdersRaw(t, i)).value()
    }
    async assetDetailsRaw(t, i) {
        const n = {};
        t.asset_id != null && (n.asset_id = t.asset_id);
        const a = {},
            o = await this.request({
                path: "/api/v1/assetDetails",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => De(r))
    }
    async assetDetails(t = {}, i) {
        return await (await this.assetDetailsRaw(t, i)).value()
    }
    async exchangeMetricsRaw(t, i) {
        if (t.period == null) throw new u("period", 'Required parameter "period" was null or undefined when calling exchangeMetrics().');
        if (t.kind == null) throw new u("kind", 'Required parameter "kind" was null or undefined when calling exchangeMetrics().');
        const n = {};
        t.period != null && (n.period = t.period), t.kind != null && (n.kind = t.kind), t.filter != null && (n.filter = t.filter), t.value != null && (n.value = t.value);
        const a = {},
            o = await this.request({
                path: "/api/v1/exchangeMetrics",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => ti(r))
    }
    async exchangeMetrics(t, i) {
        return await (await this.exchangeMetricsRaw(t, i)).value()
    }
    async exchangeStatsRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/api/v1/exchangeStats",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Tt(o))
    }
    async exchangeStats(t) {
        return await (await this.exchangeStatsRaw(t)).value()
    }
    async executeStatsRaw(t, i) {
        if (t.period == null) throw new u("period", 'Required parameter "period" was null or undefined when calling executeStats().');
        const n = {};
        t.period != null && (n.period = t.period);
        const a = {},
            o = await this.request({
                path: "/api/v1/executeStats",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => ii(r))
    }
    async executeStats(t, i) {
        return await (await this.executeStatsRaw(t, i)).value()
    }
    async orderBookDetailsRaw(t, i) {
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.filter != null && (n.filter = t.filter);
        const a = {},
            o = await this.request({
                path: "/api/v1/orderBookDetails",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => vn(r))
    }
    async orderBookDetails(t = {}, i) {
        return await (await this.orderBookDetailsRaw(t, i)).value()
    }
    async orderBookOrdersRaw(t, i) {
        if (t.market_id == null) throw new u("market_id", 'Required parameter "market_id" was null or undefined when calling orderBookOrders().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling orderBookOrders().');
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.limit != null && (n.limit = t.limit);
        const a = {},
            o = await this.request({
                path: "/api/v1/orderBookOrders",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Dn(r))
    }
    async orderBookOrders(t, i) {
        return await (await this.orderBookOrdersRaw(t, i)).value()
    }
    async orderBooksRaw(t, i) {
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.filter != null && (n.filter = t.filter);
        const a = {},
            o = await this.request({
                path: "/api/v1/orderBooks",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => An(r))
    }
    async orderBooks(t = {}, i) {
        return await (await this.orderBooksRaw(t, i)).value()
    }
    async recentTradesRaw(t, i) {
        if (t.market_id == null) throw new u("market_id", 'Required parameter "market_id" was null or undefined when calling recentTrades().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling recentTrades().');
        const n = {};
        t.market_id != null && (n.market_id = t.market_id), t.limit != null && (n.limit = t.limit);
        const a = {},
            o = await this.request({
                path: "/api/v1/recentTrades",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => A(r))
    }
    async recentTrades(t, i) {
        return await (await this.recentTradesRaw(t, i)).value()
    }
    async tradesRaw(t, i) {
        if (t.sort_by == null) throw new u("sort_by", 'Required parameter "sort_by" was null or undefined when calling trades().');
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling trades().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.market_id != null && (n.market_id = t.market_id), t.account_index != null && (n.account_index = t.account_index), t.order_index != null && (n.order_index = t.order_index), t.sort_by != null && (n.sort_by = t.sort_by), t.sort_dir != null && (n.sort_dir = t.sort_dir), t.cursor != null && (n.cursor = t.cursor), t.from != null && (n.from = t.from), t.ask_filter != null && (n.ask_filter = t.ask_filter), t.role != null && (n.role = t.role), t.type != null && (n.type = t.type), t.limit != null && (n.limit = t.limit), t.aggregate != null && (n.aggregate = t.aggregate);
        const a = {},
            o = await this.request({
                path: "/api/v1/trades",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => A(r))
    }
    async trades(t, i) {
        return await (await this.tradesRaw(t, i)).value()
    }
}
const Io = {
        Funding: "funding",
        Trade: "trade"
    },
    Go = {
        All: "all",
        Long: "long",
        Short: "short"
    };
class Co extends p {
    async referralCreateRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling referralCreate().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.auth != null && r.append("auth", t.auth), t.account_index != null && r.append("account_index", t.account_index);
        const l = await this.request({
            path: "/api/v1/referral/create",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => L(d))
    }
    async referralCreate(t, i) {
        return await (await this.referralCreateRaw(t, i)).value()
    }
    async referralGetRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling referralGet().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/referral/get",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => L(r))
    }
    async referralGet(t, i) {
        return await (await this.referralGetRaw(t, i)).value()
    }
    async referralKickbackUpdateRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling referralKickbackUpdate().');
        if (t.kickback_percentage == null) throw new u("kickback_percentage", 'Required parameter "kickback_percentage" was null or undefined when calling referralKickbackUpdate().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.auth != null && r.append("auth", t.auth), t.account_index != null && r.append("account_index", t.account_index), t.kickback_percentage != null && r.append("kickback_percentage", t.kickback_percentage);
        const l = await this.request({
            path: "/api/v1/referral/kickback/update",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => Ti(d))
    }
    async referralKickbackUpdate(t, i) {
        return await (await this.referralKickbackUpdateRaw(t, i)).value()
    }
    async referralPointsRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling referralPoints().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/referral/points",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Zn(r))
    }
    async referralPoints(t, i) {
        return await (await this.referralPointsRaw(t, i)).value()
    }
    async referralUpdateRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling referralUpdate().');
        if (t.new_referral_code == null) throw new u("new_referral_code", 'Required parameter "new_referral_code" was null or undefined when calling referralUpdate().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.auth != null && r.append("auth", t.auth), t.account_index != null && r.append("account_index", t.account_index), t.new_referral_code != null && r.append("new_referral_code", t.new_referral_code);
        const l = await this.request({
            path: "/api/v1/referral/update",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => Fi(d))
    }
    async referralUpdate(t, i) {
        return await (await this.referralUpdateRaw(t, i)).value()
    }
    async referralUseRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling referralUse().');
        if (t.referral_code == null) throw new u("referral_code", 'Required parameter "referral_code" was null or undefined when calling referralUse().');
        if (t.x == null) throw new u("x", 'Required parameter "x" was null or undefined when calling referralUse().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.auth != null && r.append("auth", t.auth), t.l1_address != null && r.append("l1_address", t.l1_address), t.referral_code != null && r.append("referral_code", t.referral_code), t.discord != null && r.append("discord", t.discord), t.telegram != null && r.append("telegram", t.telegram), t.x != null && r.append("x", t.x), t.signature != null && r.append("signature", t.signature);
        const l = await this.request({
            path: "/api/v1/referral/use",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => h(d))
    }
    async referralUse(t, i) {
        return await (await this.referralUseRaw(t, i)).value()
    }
    async referralUserReferralsRaw(t, i) {
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling referralUserReferrals().');
        const n = {};
        t.auth != null && (n.auth = t.auth), t.l1_address != null && (n.l1_address = t.l1_address), t.cursor != null && (n.cursor = t.cursor);
        const a = {};
        t.authorization != null && (a.authorization = String(t.authorization));
        const o = await this.request({
            path: "/api/v1/referral/userReferrals",
            method: "GET",
            headers: a,
            query: n
        }, i);
        return new c(o, r => Xi(r))
    }
    async referralUserReferrals(t, i) {
        return await (await this.referralUserReferralsRaw(t, i)).value()
    }
}
class Bo extends p {
    async infoRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/info",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => na(o))
    }
    async info(t) {
        return await (await this.infoRaw(t)).value()
    }
    async statusRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new c(a, o => Li(o))
    }
    async status(t) {
        return await (await this.statusRaw(t)).value()
    }
}
class Uo extends p {
    async accountTxsRaw(t, i) {
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling accountTxs().');
        if (t.by == null) throw new u("by", 'Required parameter "by" was null or undefined when calling accountTxs().');
        if (t.value == null) throw new u("value", 'Required parameter "value" was null or undefined when calling accountTxs().');
        const n = {};
        t.index != null && (n.index = t.index), t.limit != null && (n.limit = t.limit), t.by != null && (n.by = t.by), t.value != null && (n.value = t.value), t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.types != null && (n.types = t.types.join(O.csv));
        const a = {},
            o = await this.request({
                path: "/api/v1/accountTxs",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => k(r))
    }
    async accountTxs(t, i) {
        return await (await this.accountTxsRaw(t, i)).value()
    }
    async blockTxsRaw(t, i) {
        if (t.by == null) throw new u("by", 'Required parameter "by" was null or undefined when calling blockTxs().');
        if (t.value == null) throw new u("value", 'Required parameter "value" was null or undefined when calling blockTxs().');
        const n = {};
        t.by != null && (n.by = t.by), t.value != null && (n.value = t.value);
        const a = {},
            o = await this.request({
                path: "/api/v1/blockTxs",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => k(r))
    }
    async blockTxs(t, i) {
        return await (await this.blockTxsRaw(t, i)).value()
    }
    async depositHistoryRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling depositHistory().');
        if (t.l1_address == null) throw new u("l1_address", 'Required parameter "l1_address" was null or undefined when calling depositHistory().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.l1_address != null && (n.l1_address = t.l1_address), t.cursor != null && (n.cursor = t.cursor), t.filter != null && (n.filter = t.filter);
        const a = {},
            o = await this.request({
                path: "/api/v1/deposit/history",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => rt(r))
    }
    async depositHistory(t, i) {
        return await (await this.depositHistoryRaw(t, i)).value()
    }
    async nextNonceRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling nextNonce().');
        if (t.api_key_index == null) throw new u("api_key_index", 'Required parameter "api_key_index" was null or undefined when calling nextNonce().');
        const n = {};
        t.account_index != null && (n.account_index = t.account_index), t.api_key_index != null && (n.api_key_index = t.api_key_index);
        const a = {},
            o = await this.request({
                path: "/api/v1/nextNonce",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => gn(r))
    }
    async nextNonce(t, i) {
        return await (await this.nextNonceRaw(t, i)).value()
    }
    async sendTxRaw(t, i) {
        if (t.tx_type == null) throw new u("tx_type", 'Required parameter "tx_type" was null or undefined when calling sendTx().');
        if (t.tx_info == null) throw new u("tx_info", 'Required parameter "tx_info" was null or undefined when calling sendTx().');
        const n = {},
            a = {};
        s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.tx_type != null && r.append("tx_type", t.tx_type), t.tx_info != null && r.append("tx_info", t.tx_info), t.price_protection != null && r.append("price_protection", t.price_protection);
        const l = await this.request({
            path: "/api/v1/sendTx",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => ki(d))
    }
    async sendTx(t, i) {
        return await (await this.sendTxRaw(t, i)).value()
    }
    async sendTxBatchRaw(t, i) {
        if (t.tx_types == null) throw new u("tx_types", 'Required parameter "tx_types" was null or undefined when calling sendTxBatch().');
        if (t.tx_infos == null) throw new u("tx_infos", 'Required parameter "tx_infos" was null or undefined when calling sendTxBatch().');
        const n = {},
            a = {};
        s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.tx_types != null && r.append("tx_types", t.tx_types), t.tx_infos != null && r.append("tx_infos", t.tx_infos);
        const l = await this.request({
            path: "/api/v1/sendTxBatch",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => Si(d))
    }
    async sendTxBatch(t, i) {
        return await (await this.sendTxBatchRaw(t, i)).value()
    }
    async setAccountMetadataRaw(t, i) {
        if (t.master_account_index == null) throw new u("master_account_index", 'Required parameter "master_account_index" was null or undefined when calling setAccountMetadata().');
        if (t.target_account_index == null) throw new u("target_account_index", 'Required parameter "target_account_index" was null or undefined when calling setAccountMetadata().');
        if (t.api_key_index == null) throw new u("api_key_index", 'Required parameter "api_key_index" was null or undefined when calling setAccountMetadata().');
        if (t.metadata == null) throw new u("metadata", 'Required parameter "metadata" was null or undefined when calling setAccountMetadata().');
        const n = {},
            a = {};
        t.authorization != null && (a.authorization = String(t.authorization)), s([{
            contentType: "multipart/form-data"
        }]);
        let r;
        r = new URLSearchParams, t.master_account_index != null && r.append("master_account_index", t.master_account_index), t.target_account_index != null && r.append("target_account_index", t.target_account_index), t.api_key_index != null && r.append("api_key_index", t.api_key_index), t.metadata != null && r.append("metadata", t.metadata), t.auth != null && r.append("auth", t.auth);
        const l = await this.request({
            path: "/api/v1/setAccountMetadata",
            method: "POST",
            headers: a,
            query: n,
            body: r
        }, i);
        return new c(l, d => h(d))
    }
    async setAccountMetadata(t, i) {
        return await (await this.setAccountMetadataRaw(t, i)).value()
    }
    async transferHistoryRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling transferHistory().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.cursor != null && (n.cursor = t.cursor), t.type != null && (n.type = t.type.join(O.csv));
        const a = {},
            o = await this.request({
                path: "/api/v1/transfer/history",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => Vi(r))
    }
    async transferHistory(t, i) {
        return await (await this.transferHistoryRaw(t, i)).value()
    }
    async txRaw(t, i) {
        if (t.by == null) throw new u("by", 'Required parameter "by" was null or undefined when calling tx().');
        if (t.value == null) throw new u("value", 'Required parameter "value" was null or undefined when calling tx().');
        const n = {};
        t.by != null && (n.by = t.by), t.value != null && (n.value = t.value);
        const a = {},
            o = await this.request({
                path: "/api/v1/tx",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => F(r))
    }
    async tx(t, i) {
        return await (await this.txRaw(t, i)).value()
    }
    async txFromL1TxHashRaw(t, i) {
        if (t.hash == null) throw new u("hash", 'Required parameter "hash" was null or undefined when calling txFromL1TxHash().');
        const n = {};
        t.hash != null && (n.hash = t.hash);
        const a = {},
            o = await this.request({
                path: "/api/v1/txFromL1TxHash",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => F(r))
    }
    async txFromL1TxHash(t, i) {
        return await (await this.txFromL1TxHashRaw(t, i)).value()
    }
    async txsRaw(t, i) {
        if (t.limit == null) throw new u("limit", 'Required parameter "limit" was null or undefined when calling txs().');
        const n = {};
        t.index != null && (n.index = t.index), t.limit != null && (n.limit = t.limit);
        const a = {},
            o = await this.request({
                path: "/api/v1/txs",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => k(r))
    }
    async txs(t, i) {
        return await (await this.txsRaw(t, i)).value()
    }
    async withdrawHistoryRaw(t, i) {
        if (t.account_index == null) throw new u("account_index", 'Required parameter "account_index" was null or undefined when calling withdrawHistory().');
        const n = {};
        t.authorization != null && (n.authorization = t.authorization), t.auth != null && (n.auth = t.auth), t.account_index != null && (n.account_index = t.account_index), t.cursor != null && (n.cursor = t.cursor), t.filter != null && (n.filter = t.filter);
        const a = {},
            o = await this.request({
                path: "/api/v1/withdraw/history",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new c(o, r => ea(r))
    }
    async withdrawHistory(t, i) {
        return await (await this.withdrawHistoryRaw(t, i)).value()
    }
}
const Mo = {
        All: "all",
        L2Transfer: "L2Transfer",
        L2MintShares: "L2MintShares",
        L2BurnShares: "L2BurnShares",
        L2StakeAssets: "L2StakeAssets",
        L2UnstakeAssets: "L2UnstakeAssets"
    },
    aa = "/api".replace(/\/+$/, "");
class ra {
    constructor(t = {}) {
        this.configuration = t
    }
    set config(t) {
        this.configuration = t
    }
    get basePath() {
        return this.configuration.basePath != null ? this.configuration.basePath : aa
    }
    get fetchApi() {
        return this.configuration.fetchApi
    }
    get middleware() {
        return this.configuration.middleware || []
    }
    get queryParamsStringify() {
        return this.configuration.queryParamsStringify || U
    }
    get username() {
        return this.configuration.username
    }
    get password() {
        return this.configuration.password
    }
    get apiKey() {
        const t = this.configuration.apiKey;
        if (t) return typeof t == "function" ? t : () => t
    }
    get accessToken() {
        const t = this.configuration.accessToken;
        if (t) return typeof t == "function" ? t : async () => t
    }
    get headers() {
        return this.configuration.headers
    }
    get credentials() {
        return this.configuration.credentials
    }
}
const oa = new ra;
class f {
    constructor(t = oa) {
        this.configuration = t, this.middleware = t.middleware
    }
    static jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
    middleware;
    withMiddleware(...t) {
        const i = this.clone();
        return i.middleware = i.middleware.concat(...t), i
    }
    withPreMiddleware(...t) {
        const i = t.map(n => ({
            pre: n
        }));
        return this.withMiddleware(...i)
    }
    withPostMiddleware(...t) {
        const i = t.map(n => ({
            post: n
        }));
        return this.withMiddleware(...i)
    }
    isJsonMime(t) {
        return t ? f.jsonRegex.test(t) : !1
    }
    async request(t, i) {
        const {
            url: n,
            init: a
        } = await this.createFetchParams(t, i), o = await this.fetchApi(n, a);
        if (o && o.status >= 200 && o.status < 300) return o;
        throw new la(o, "Response returned an error code")
    }
    async createFetchParams(t, i) {
        let n = this.configuration.basePath + t.path;
        t.query !== void 0 && Object.keys(t.query).length !== 0 && (n += "?" + this.configuration.queryParamsStringify(t.query));
        const a = Object.assign({}, this.configuration.headers, t.headers);
        Object.keys(a).forEach(g => a[g] === void 0 ? delete a[g] : {});
        const o = typeof i == "function" ? i : async () => i,
            r = {
                method: t.method,
                headers: a,
                body: t.body,
                credentials: this.configuration.credentials
            },
            l = { ...r,
                ...await o({
                    init: r,
                    context: t
                })
            };
        let d;
        ca(l.body) || l.body instanceof URLSearchParams || ua(l.body) ? d = l.body : this.isJsonMime(a["Content-Type"]) ? d = JSON.stringify(l.body) : d = l.body;
        const x = { ...l,
            body: d
        };
        return {
            url: n,
            init: x
        }
    }
    fetchApi = async (t, i) => {
        let n = {
            url: t,
            init: i
        };
        for (const o of this.middleware) o.pre && (n = await o.pre({
            fetch: this.fetchApi,
            ...n
        }) || n);
        let a;
        try {
            a = await (this.configuration.fetchApi || fetch)(n.url, n.init)
        } catch (o) {
            for (const r of this.middleware) r.onError && (a = await r.onError({
                fetch: this.fetchApi,
                url: n.url,
                init: n.init,
                error: o,
                response: a ? a.clone() : void 0
            }) || a);
            if (a === void 0) throw o instanceof Error ? new da(o, "The request failed and the interceptors did not return an alternative response") : o
        }
        for (const o of this.middleware) o.post && (a = await o.post({
            fetch: this.fetchApi,
            url: n.url,
            init: n.init,
            response: a.clone()
        }) || a);
        return a
    };
    clone() {
        const t = this.constructor,
            i = new t(this.configuration);
        return i.middleware = this.middleware.slice(), i
    }
}

function ua(e) {
    return typeof Blob < "u" && e instanceof Blob
}

function ca(e) {
    return typeof FormData < "u" && e instanceof FormData
}
class la extends Error {
    constructor(t, i) {
        super(i), this.response = t
    }
    name = "ResponseError"
}
class da extends Error {
    constructor(t, i) {
        super(i), this.cause = t
    }
    name = "FetchError"
}
class m extends Error {
    constructor(t, i) {
        super(i), this.field = t
    }
    name = "RequiredError"
}
const sa = {
    csv: ","
};

function U(e, t = "") {
    return Object.keys(e).map(i => M(i, e[i], t)).filter(i => i.length > 0).join("&")
}

function M(e, t, i = "") {
    const n = i + (i.length ? `[${e}]` : e);
    if (t instanceof Array) {
        const a = t.map(o => encodeURIComponent(String(o))).join(`&${encodeURIComponent(n)}=`);
        return `${encodeURIComponent(n)}=${a}`
    }
    if (t instanceof Set) {
        const a = Array.from(t);
        return M(e, a, i)
    }
    return t instanceof Date ? `${encodeURIComponent(n)}=${encodeURIComponent(t.toISOString())}` : t instanceof Object ? U(t, n) : `${encodeURIComponent(n)}=${encodeURIComponent(String(t))}`
}

function H(e, t) {
    return Object.keys(e).reduce((i, n) => ({ ...i,
        [n]: t(e[n])
    }), {})
}
class _ {
    constructor(t, i = n => n) {
        this.raw = t, this.transformer = i
    }
    async value() {
        return this.transformer(await this.raw.json())
    }
}

function _a(e) {
    return pa(e)
}

function pa(e, t) {
    return e == null ? e : {
        asset_id: e.asset_id,
        balance: e.balance,
        locked_balance: e.locked_balance,
        symbol: e.symbol
    }
}

function $(e) {
    return ma(e)
}

function ma(e, t) {
    return e == null ? e : {
        assets: H(e.assets, _a)
    }
}
const Ho = {
    TxType_L2forceBurnShares: "L2ForceBurnShares"
};

function b(e) {
    return fa(e)
}

function fa(e, t) {
    return e
}
const $o = {
    BatchStatus_NothingToExecute: "nothing_to_execute",
    BatchStatus_Committed: "committed",
    BatchStatus_Verified: "verified",
    BatchStatus_Executed: "executed"
};

function w(e) {
    return ha(e)
}

function ha(e, t) {
    return e
}

function S(e) {
    return wa(e)
}

function wa(e, t) {
    return e
}

function ga(e) {
    return ya(e)
}

function ya(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        operator_fee_share_amount: e.operator_fee_share_amount,
        public_pool_index: e.public_pool_index,
        shares_to_burn: e.shares_to_burn,
        shares_to_burn_usdc: e.shares_to_burn_usdc
    }
}

function xa(e) {
    return ka(e)
}

function ka(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        public_pool_index: e.public_pool_index,
        share_amount: e.share_amount,
        usdc_amount: e.usdc_amount
    }
}

function ba(e) {
    return Sa(e)
}

function Sa(e, t) {
    return e == null ? e : {
        asset_index: e.asset_index,
        margin_mode: e.margin_mode,
        min_transfer_amount: e.min_transfer_amount,
        min_withdrawal_amount: e.min_withdrawal_amount
    }
}

function Ra(e) {
    return Ta(e)
}

function Ta(e, t) {
    return e == null ? e : {
        base_asset_id: e.base_asset_id,
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        min_base_amount: e.min_base_amount,
        min_quote_amount: e.min_quote_amount,
        order_quote_limit: e.order_quote_limit,
        quote_asset_id: e.quote_asset_id,
        quote_extension_multiplier: e.quote_extension_multiplier,
        size_extension_multiplier: e.size_extension_multiplier,
        taker_fee: e.taker_fee
    }
}

function Oa(e) {
    return Fa(e)
}

function Fa(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        amount: e.amount,
        asset_symbol: e.asset_symbol
    }
}

function va(e) {
    return Na(e)
}

function Na(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        market_index: e.market_index,
        settlement_price: e.settlement_price
    }
}

function Ja(e) {
    return Da(e)
}

function Da(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        l1_address: e.l1_address,
        usdc_amount: e.usdc_amount
    }
}

function La(e) {
    return Aa(e)
}

function Aa(e, t) {
    return e == null ? e : {
        asset_index: e.asset_index,
        extension_multiplier: e.extension_multiplier,
        margin_mode: e.margin_mode,
        min_transfer_amount: e.min_transfer_amount,
        min_withdrawal_amount: e.min_withdrawal_amount
    }
}

function Ea(e) {
    return za(e)
}

function za(e, t) {
    return e == null ? e : {
        asset_index: e.asset_index,
        moved_asset_amount: e.moved_asset_amount
    }
}

function Ia(e) {
    return Ga(e)
}

function Ga(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        account_trading_mode: e.account_trading_mode,
        asset_amounts: e.asset_amounts.map(Ea)
    }
}

function Ca(e) {
    return Ba(e)
}

function Ba(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        direction: e.direction,
        market_index: e.market_index,
        usdc_amount: e.usdc_amount
    }
}

function Ua(e) {
    return Ma(e)
}

function Ma(e, t) {
    return e == null ? e : {
        from_account_index: e.from_account_index,
        usdc_amount: e.usdc_amount
    }
}

function Ha(e) {
    return $a(e)
}

function $a(e, t) {
    return e == null ? e : {
        amount: e.amount,
        asset_index: e.asset_index,
        fee_account_index: e.fee_account_index,
        from_account_index: e.from_account_index,
        from_route_type: e.from_route_type,
        to_account_index: e.to_account_index,
        to_route_type: e.to_route_type,
        usdc_fee: e.usdc_fee
    }
}

function Wa(e) {
    return Va(e)
}

function Va(e, t) {
    return e == null ? e : {
        amount: e.amount,
        asset_index: e.asset_index,
        from_account_index: e.from_account_index,
        route_type: e.route_type
    }
}

function Ka(e) {
    return Za(e)
}

function Za(e, t) {
    return e == null ? e : {
        close_out_margin_fraction: e.close_out_margin_fraction,
        default_initial_margin_fraction: e.default_initial_margin_fraction,
        funding_clamp_big: e.funding_clamp_big,
        funding_clamp_small: e.funding_clamp_small,
        interest_rate: e.interest_rate,
        liquidation_fee: e.liquidation_fee,
        maintenance_margin_fraction: e.maintenance_margin_fraction,
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        min_base_amount: e.min_base_amount,
        min_initial_margin_fraction: e.min_initial_margin_fraction,
        min_quote_amount: e.min_quote_amount,
        open_interest_limit: e.open_interest_limit,
        order_quote_limit: e.order_quote_limit,
        quote_multiplier: e.quote_multiplier,
        taker_fee: e.taker_fee
    }
}

function Ya(e) {
    return Qa(e)
}

function Qa(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        lit_amount: e.lit_amount,
        share_amount: e.share_amount,
        staking_pool_index: e.staking_pool_index
    }
}

function Xa(e) {
    return qa(e)
}

function qa(e, t) {
    return e == null ? e : {
        min_operator_share_rate: e.min_operator_share_rate,
        operator_fee: e.operator_fee,
        public_pool_index: e.public_pool_index,
        status: e.status
    }
}

function Pa(e) {
    return ja(e)
}

function ja(e, t) {
    return e == null ? e : {
        accepted_amount: e.accepted_amount,
        account_index: e.account_index,
        asset_index: e.asset_index,
        l1_address: e.l1_address,
        route_type: e.route_type
    }
}

function er(e) {
    return tr(e)
}

function tr(e, t) {
    return e == null ? e : {
        bankrupt_account_index: e.bankrupt_account_index,
        deleverager_account_index: e.deleverager_account_index,
        is_taker_ask: e.is_taker_ask,
        market_index: e.market_index,
        quote: e.quote,
        size: e.size
    }
}

function nr(e) {
    return ir(e)
}

function ir(e, t) {
    return e == null ? e : {
        fee_account_index: e.fee_account_index,
        funding_rate_prefix_sum: e.funding_rate_prefix_sum,
        is_taker_ask: e.is_taker_ask,
        maker_account_index: e.maker_account_index,
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        price: e.price,
        size: e.size,
        taker_account_index: e.taker_account_index,
        taker_fee: e.taker_fee,
        trade_type: e.trade_type
    }
}

function ar(e) {
    return rr(e)
}

function rr(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        initial_total_shares: e.initial_total_shares,
        min_operator_share_rate: e.min_operator_share_rate,
        operator_fee: e.operator_fee,
        public_pool_index: e.public_pool_index
    }
}

function or(e) {
    return ur(e)
}

function ur(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        funding_rate_prefix_sum: e.funding_rate_prefix_sum,
        market_index: e.market_index,
        settlement_price: e.settlement_price
    }
}

function cr(e) {
    return lr(e)
}

function lr(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        initial_total_shares: e.initial_total_shares,
        min_operator_share_rate: e.min_operator_share_rate,
        staking_pool_index: e.staking_pool_index
    }
}

function dr(e) {
    return sr(e)
}

function sr(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        lit_amount: e.lit_amount,
        share_amount: e.share_amount,
        staking_pool_index: e.staking_pool_index
    }
}

function _r(e) {
    return pr(e)
}

function pr(e, t) {
    return e == null ? e : {
        fee_account_index: e.fee_account_index,
        is_taker_ask: e.is_taker_ask,
        maker_account_index: e.maker_account_index,
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        price: e.price,
        size: e.size,
        taker_account_index: e.taker_account_index,
        taker_fee: e.taker_fee,
        trade_type: e.trade_type
    }
}

function mr(e) {
    return fr(e)
}

function fr(e, t) {
    return e == null ? e : {
        close_out_margin_fraction: e.close_out_margin_fraction,
        default_initial_margin_fraction: e.default_initial_margin_fraction,
        interest_rate: e.interest_rate,
        liquidation_fee: e.liquidation_fee,
        maintenance_margin_fraction: e.maintenance_margin_fraction,
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        min_base_amount: e.min_base_amount,
        min_initial_margin_fraction: e.min_initial_margin_fraction,
        min_quote_amount: e.min_quote_amount,
        status: e.status,
        taker_fee: e.taker_fee
    }
}

function hr(e) {
    return wr(e)
}

function wr(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        initial_margin_fraction: e.initial_margin_fraction,
        margin_mode: e.margin_mode,
        market_index: e.market_index
    }
}

function gr(e) {
    return yr(e)
}

function yr(e, t) {
    return e == null ? e : {
        from_account_index: e.from_account_index,
        to_account_index: e.to_account_index,
        usdc_amount: e.usdc_amount
    }
}

function xr(e) {
    return kr(e)
}

function kr(e, t) {
    return e == null ? e : {
        close_out_margin_fraction: e.close_out_margin_fraction,
        default_initial_margin_fraction: e.default_initial_margin_fraction,
        interest_rate: e.interest_rate,
        liquidation_fee: e.liquidation_fee,
        maintenance_margin_fraction: e.maintenance_margin_fraction,
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        min_base_amount: e.min_base_amount,
        min_initial_margin_fraction: e.min_initial_margin_fraction,
        min_quote_amount: e.min_quote_amount,
        quote_multiplier: e.quote_multiplier,
        taker_fee: e.taker_fee
    }
}

function br(e) {
    return Sr(e)
}

function Sr(e, t) {
    return e == null ? e : {
        liquidity_pool_cooldown_period: e.liquidity_pool_cooldown_period,
        liquidity_pool_index: e.liquidity_pool_index,
        staking_pool_index: e.staking_pool_index,
        staking_pool_lockup_period: e.staking_pool_lockup_period
    }
}

function Rr(e) {
    return Tr(e)
}

function Tr(e, t) {
    return e == null ? e : {
        bankrupt_account_index: e.bankrupt_account_index,
        deleverager_account_index: e.deleverager_account_index,
        funding_rate_prefix_sum: e.funding_rate_prefix_sum,
        is_taker_ask: e.is_taker_ask,
        market_index: e.market_index,
        quote: e.quote,
        size: e.size
    }
}

function Or(e) {
    return Fr(e)
}

function Fr(e, t) {
    return e == null ? e : {
        maker_fee: e.maker_fee,
        market_index: e.market_index,
        min_base_amount: e.min_base_amount,
        min_quote_amount: e.min_quote_amount,
        order_quote_limit: e.order_quote_limit,
        status: e.status,
        taker_fee: e.taker_fee
    }
}

function vr(e) {
    return Nr(e)
}

function Nr(e, t) {
    return e == null ? e : {
        account_index: e.account_index,
        subAccount_index: e.subAccount_index
    }
}

function R(e) {
    return Jr(e)
}

function Jr(e, t) {
    return e == null ? e : {
        burned_shares_pubdata: ga(e.burned_shares_pubdata),
        deleverage_pubdata: er(e.deleverage_pubdata),
        deleverage_pubdata_with_funding: Rr(e.deleverage_pubdata_with_funding),
        executed_pending_unlock_pubdata: Oa(e.executed_pending_unlock_pubdata),
        exit_position_pubdata: va(e.exit_position_pubdata),
        exit_position_pubdata_with_funding: or(e.exit_position_pubdata_with_funding),
        l1_create_market_pubdata: xr(e.l1_create_market_pubdata),
        l1_create_market_pubdata_v2: Ka(e.l1_create_market_pubdata_v2),
        l1_create_spot_market_pubdata: Ra(e.l1_create_spot_market_pubdata),
        l1_deposit_pubdata: Ja(e.l1_deposit_pubdata),
        l1_deposit_pubdata_v2: Pa(e.l1_deposit_pubdata_v2),
        l1_register_asset_pubdata: La(e.l1_register_asset_pubdata),
        l1_set_system_config_pubdata: br(e.l1_set_system_config_pubdata),
        l1_update_asset_pubdata: ba(e.l1_update_asset_pubdata),
        l1_update_market_pubdata: mr(e.l1_update_market_pubdata),
        l1_update_spot_market_pubdata: Or(e.l1_update_spot_market_pubdata),
        l2_create_public_pool_pubdata: ar(e.l2_create_public_pool_pubdata),
        l2_create_staking_pool_pubdata: cr(e.l2_create_staking_pool_pubdata),
        l2_create_sub_account_pubdata: vr(e.l2_create_sub_account_pubdata),
        l2_mint_shares_pubdata: xa(e.l2_mint_shares_pubdata),
        l2_stake_assets_pubdata: dr(e.l2_stake_assets_pubdata),
        l2_transfer_pubdata: gr(e.l2_transfer_pubdata),
        l2_transfer_pubdata_v2: Ha(e.l2_transfer_pubdata_v2),
        l2_update_account_config_pubdata: Ia(e.l2_update_account_config_pubdata),
        l2_update_leverage_pubdata: hr(e.l2_update_leverage_pubdata),
        l2_update_margin_pubdata: Ca(e.l2_update_margin_pubdata),
        l2_update_public_pool_pubdata: Xa(e.l2_update_public_pool_pubdata),
        trade_pubdata: _r(e.trade_pubdata),
        trade_pubdata_with_funding: nr(e.trade_pubdata_with_funding),
        unstake_assets_pubdata: Ya(e.unstake_assets_pubdata),
        withdraw_pubdata: Ua(e.withdraw_pubdata),
        withdraw_pubdata_v2: Wa(e.withdraw_pubdata_v2)
    }
}

function T(e) {
    return Dr(e)
}

function Dr(e, t) {
    return e == null ? e : {
        hash: e.hash,
        pubdata: R(e.pubdata),
        pubdata_type: S(e.pubdata_type),
        status: w(e.status),
        time: e.time,
        tx_type: b(e.tx_type)
    }
}
const Wo = {
    Account: "account",
    Block: "block",
    Batch: "batch",
    Log: "log"
};

function Lr(e) {
    return Ar(e)
}

function Ar(e, t) {
    return e
}

function W(e) {
    return Er(e)
}

function Er(e, t) {
    return e == null ? e : {
        batch_number: e.batch_number,
        block_number: e.block_number,
        hash: e.hash,
        pubdata: R(e.pubdata),
        pubdata_type: S(e.pubdata_type),
        status: w(e.status),
        time: e.time,
        tx_type: b(e.tx_type)
    }
}

function y(e) {
    return zr(e)
}

function zr(e, t) {
    return e == null ? e : {
        commit_tx_hash: e.commit_tx_hash,
        execute_tx_hash: e.execute_tx_hash,
        verify_tx_hash: e.verify_tx_hash
    }
}

function Ir(e) {
    return Gr(e)
}

function Gr(e, t) {
    return e == null ? e : {
        batch_status: w(e.batch_status),
        hash: e.hash,
        updated_at: e.updated_at
    }
}

function Cr(e) {
    return Br(e)
}

function Br(e, t) {
    return e == null ? e : {
        block_number: e.block_number,
        total_transactions: e.total_transactions,
        updated_at: e.updated_at
    }
}

function V(e) {
    return Ur(e)
}

function Ur(e, t) {
    return e == null ? e : {
        batch_details: y(e.batch_details),
        batch_number: e.batch_number,
        blocks: e.blocks.map(Cr),
        status_changes: e.status_changes.map(Ir),
        updated_at: e.updated_at
    }
}

function Mr(e) {
    return Hr(e)
}

function Hr(e, t) {
    return e == null ? e : {
        index_price: e.index_price,
        last_funding_rate: e.last_funding_rate,
        market_index: e.market_index,
        market_price: e.market_price,
        open_interest: e.open_interest
    }
}

function K(e) {
    return $r(e)
}

function $r(e, t) {
    return e == null ? e : {
        batch_details: y(e.batch_details),
        batch_number: e.batch_number,
        batch_status: w(e.batch_status),
        batch_status_time: e.batch_status_time,
        block_number: e.block_number,
        logs: e.logs.map(T),
        markets: e.markets.map(Mr),
        total_transactions: e.total_transactions
    }
}

function Wr(e) {
    return Vr(e)
}

function Vr(e, t) {
    return e
}

function Kr(e) {
    return Zr(e)
}

function Zr(e, t) {
    return e == null ? e : {
        entry_price: e.entry_price,
        market_index: e.market_index,
        pnl: e.pnl,
        side: Wr(e.side),
        size: e.size
    }
}

function Z(e) {
    return Yr(e)
}

function Yr(e, t) {
    return e == null ? e : {
        positions: H(e.positions, Kr)
    }
}

function Qr(e) {
    return Xr(e)
}

function Xr(e, t) {
    return e == null ? e : {
        account_assets: e.account_assets == null ? void 0 : $(e.account_assets),
        account_logs: e.account_logs == null ? void 0 : e.account_logs.map(T),
        account_positions: e.account_positions == null ? void 0 : Z(e.account_positions),
        batch: e.batch == null ? void 0 : V(e.batch),
        block: e.block == null ? void 0 : K(e.block),
        log: e.log == null ? void 0 : W(e.log),
        type: Lr(e.type)
    }
}

function qr(e) {
    return Pr(e)
}

function Pr(e, t) {
    return e == null ? e : {
        market_index: e.market_index,
        symbol: e.symbol
    }
}

function jr(e) {
    return eo(e)
}

function eo(e, t) {
    return e == null ? e : {
        hash: e.hash,
        pubdata: R(e.pubdata),
        pubdata_type: S(e.pubdata_type),
        time: e.time,
        tx_type: b(e.tx_type)
    }
}

function to(e) {
    return no(e)
}

function no(e, t) {
    return e == null ? e : {
        batch_details: y(e.batch_details),
        batch_number: e.batch_number,
        batch_size: e.batch_size,
        batch_status: w(e.batch_status),
        updated_at: e.updated_at
    }
}

function io(e) {
    return ao(e)
}

function ao(e, t) {
    return e == null ? e : {
        batch_details: y(e.batch_details),
        batch_status: w(e.batch_status),
        block_height: e.block_height,
        block_size: e.block_size,
        updated_at: e.updated_at
    }
}

function ro(e) {
    return oo(e)
}

function oo(e, t) {
    return e == null ? e : {
        accounts: e.accounts,
        batches: e.batches,
        blocks: e.blocks,
        txs: e.txs
    }
}
class Vo extends f {
    async accountsParamAssetsGetRaw(t, i) {
        if (t.param == null) throw new m("param", 'Required parameter "param" was null or undefined when calling accountsParamAssetsGet().');
        const n = {},
            a = {},
            o = await this.request({
                path: "/accounts/{param}/assets".replace("{param}", encodeURIComponent(String(t.param))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => $(r))
    }
    async accountsParamAssetsGet(t, i) {
        return await (await this.accountsParamAssetsGetRaw(t, i)).value()
    }
    async accountsParamLogsGetRaw(t, i) {
        if (t.param == null) throw new m("param", 'Required parameter "param" was null or undefined when calling accountsParamLogsGet().');
        if (t.limit == null) throw new m("limit", 'Required parameter "limit" was null or undefined when calling accountsParamLogsGet().');
        if (t.offset == null) throw new m("offset", 'Required parameter "offset" was null or undefined when calling accountsParamLogsGet().');
        const n = {};
        t.pub_data_type != null && (n.pub_data_type = t.pub_data_type.join(sa.csv)), t.limit != null && (n.limit = t.limit), t.offset != null && (n.offset = t.offset);
        const a = {},
            o = await this.request({
                path: "/accounts/{param}/logs".replace("{param}", encodeURIComponent(String(t.param))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => r.map(T))
    }
    async accountsParamLogsGet(t, i) {
        return await (await this.accountsParamLogsGetRaw(t, i)).value()
    }
    async accountsParamPositionsGetRaw(t, i) {
        if (t.param == null) throw new m("param", 'Required parameter "param" was null or undefined when calling accountsParamPositionsGet().');
        const n = {},
            a = {},
            o = await this.request({
                path: "/accounts/{param}/positions".replace("{param}", encodeURIComponent(String(t.param))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => Z(r))
    }
    async accountsParamPositionsGet(t, i) {
        return await (await this.accountsParamPositionsGetRaw(t, i)).value()
    }
}
const Ko = {
    Empty: "Empty",
    L1Deposit: "L1Deposit",
    L1CreateMarket: "L1CreateMarket",
    L1UpdateMarket: "L1UpdateMarket",
    L2CreateSubAccount: "L2CreateSubAccount",
    L2CreatePublicPool: "L2CreatePublicPool",
    L2UpdatePublicPool: "L2UpdatePublicPool",
    L2MintShares: "L2MintShares",
    L2UpdateLeverage: "L2UpdateLeverage",
    L2UpdateMargin: "L2UpdateMargin",
    L2Transfer: "L2Transfer",
    Withdraw: "Withdraw",
    Trade: "Trade",
    TradeWithFunding: "TradeWithFunding",
    LiquidationTrade: "LiquidationTrade",
    LiquidationTradeWithFunding: "LiquidationTradeWithFunding",
    BurnedShares: "BurnedShares",
    ExitPosition: "ExitPosition",
    ExitPositionWithFunding: "ExitPositionWithFunding",
    Deleverage: "Deleverage",
    DeleverageWithFunding: "DeleverageWithFunding",
    L1RegisterAsset: "L1RegisterAsset",
    L1UpdateAsset: "L1UpdateAsset",
    L1CreateSpotMarket: "L1CreateSpotMarket",
    L1UpdateSpotMarket: "L1UpdateSpotMarket",
    WithdrawV2: "WithdrawV2",
    L1CreateMarketV2: "L1CreateMarketV2",
    L1DepositV2: "L1DepositV2",
    L1UpdateMarketV2: "L1UpdateMarketV2",
    L2TransferV2: "L2TransferV2",
    L2CreateStakingPool: "L2CreateStakingPool",
    L2UpdateStakingPool: "L2UpdateStakingPool",
    L2StakeAssets: "L2StakeAssets",
    UnstakeAssets: "UnstakeAssets",
    L1SetSystemConfig: "L1SetSystemConfig",
    ExecutedPendingUnlock: "ExecutedPendingUnlock",
    L2UpdateAccountConfig: "L2UpdateAccountConfig",
    L2UpdateMarketConfig: "L2UpdateMarketConfig"
};
class Zo extends f {
    async batchesBatchIdGetRaw(t, i) {
        if (t.batchId == null) throw new m("batchId", 'Required parameter "batchId" was null or undefined when calling batchesBatchIdGet().');
        const n = {},
            a = {},
            o = await this.request({
                path: "/batches/{batchId}".replace("{batchId}", encodeURIComponent(String(t.batchId))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => V(r))
    }
    async batchesBatchIdGet(t, i) {
        return await (await this.batchesBatchIdGetRaw(t, i)).value()
    }
    async batchesGetRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/batches",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new _(a, o => o.map(to))
    }
    async batchesGet(t) {
        return await (await this.batchesGetRaw(t)).value()
    }
}
class Yo extends f {
    async blocksBlockIdGetRaw(t, i) {
        if (t.blockId == null) throw new m("blockId", 'Required parameter "blockId" was null or undefined when calling blocksBlockIdGet().');
        const n = {},
            a = {},
            o = await this.request({
                path: "/blocks/{blockId}".replace("{blockId}", encodeURIComponent(String(t.blockId))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => K(r))
    }
    async blocksBlockIdGet(t, i) {
        return await (await this.blocksBlockIdGetRaw(t, i)).value()
    }
    async blocksGetRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/blocks",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new _(a, o => o.map(io))
    }
    async blocksGet(t) {
        return await (await this.blocksGetRaw(t)).value()
    }
}
class Qo extends f {
    async logsHashGetRaw(t, i) {
        if (t.hash == null) throw new m("hash", 'Required parameter "hash" was null or undefined when calling logsHashGet().');
        const n = {},
            a = {},
            o = await this.request({
                path: "/logs/{hash}".replace("{hash}", encodeURIComponent(String(t.hash))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => W(r))
    }
    async logsHashGet(t, i) {
        return await (await this.logsHashGetRaw(t, i)).value()
    }
}
class Xo extends f {
    async marketsGetRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/markets",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new _(a, o => o.map(qr))
    }
    async marketsGet(t) {
        return await (await this.marketsGetRaw(t)).value()
    }
    async marketsSymbolLogsGetRaw(t, i) {
        if (t.symbol == null) throw new m("symbol", 'Required parameter "symbol" was null or undefined when calling marketsSymbolLogsGet().');
        const n = {},
            a = {},
            o = await this.request({
                path: "/markets/{symbol}/logs".replace("{symbol}", encodeURIComponent(String(t.symbol))),
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => r.map(jr))
    }
    async marketsSymbolLogsGet(t, i) {
        return await (await this.marketsSymbolLogsGetRaw(t, i)).value()
    }
}
class qo extends f {
    async searchGetRaw(t, i) {
        if (t.q == null) throw new m("q", 'Required parameter "q" was null or undefined when calling searchGet().');
        const n = {};
        t.q != null && (n.q = t.q);
        const a = {},
            o = await this.request({
                path: "/search",
                method: "GET",
                headers: a,
                query: n
            }, i);
        return new _(o, r => r.map(Qr))
    }
    async searchGet(t, i) {
        return await (await this.searchGetRaw(t, i)).value()
    }
}
class Po extends f {
    async totalGetRaw(t) {
        const i = {},
            n = {},
            a = await this.request({
                path: "/total",
                method: "GET",
                headers: n,
                query: i
            }, t);
        return new _(a, o => ro(o))
    }
    async totalGet(t) {
        return await (await this.totalGetRaw(t)).value()
    }
}
export {
    To as A, No as B, Q as C, po as D, Io as E, Do as F, Lo as G, Wo as H, Ao as I, Qo as L, Xo as M, Eo as N, wo as O, Fo as P, j as R, qo as S, ko as T, Ro as W, ho as a, go as b, yo as c, Bo as d, vo as e, Jo as f, Uo as g, zo as h, Co as i, So as j, Vo as k, ra as l, Yo as m, Zo as n, Po as o, $o as p, Ko as q, Ho as r, Go as s, Mo as t, xo as u, fo as v, bo as w, mo as x
};
//# sourceMappingURL=vendor-zklighter-CvMjegap.js.map