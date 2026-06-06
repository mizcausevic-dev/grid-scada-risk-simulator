create or replace view utility.scada_asset_risk as
with scored as (
  select
    asset_id,
    owner,
    control_latency_ms,
    telemetry_drift_minutes,
    manual_override_count,
    blast_radius_customers,
    patch_lag_days,
    redundancy_score,
    least(
      100,
      control_latency_ms * 0.035
        + telemetry_drift_minutes * 0.95
        + manual_override_count * 5.4
        + blast_radius_customers * 0.0011
        + patch_lag_days * 0.52
        - redundancy_score * 0.28
    ) as scada_risk_score
  from utility.raw_scada_scenarios
)
select
  asset_id,
  owner,
  control_latency_ms,
  telemetry_drift_minutes,
  manual_override_count,
  blast_radius_customers,
  patch_lag_days,
  redundancy_score,
  scada_risk_score,
  case
    when scada_risk_score >= 72 then 'critical'
    when scada_risk_score >= 38 then 'watch'
    else 'stable'
  end as scada_posture
from scored;

create or replace view utility.board_scada_posture as
select
  scada_posture,
  count(*) as asset_count,
  avg(scada_risk_score) as average_scada_risk,
  max(blast_radius_customers) as max_blast_radius_customers
from utility.scada_asset_risk
group by scada_posture;
