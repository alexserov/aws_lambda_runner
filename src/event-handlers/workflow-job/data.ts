import knownLabel from '../../known-labels';

// https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#workflow_job
export type RawJob = {
  action: 'queued' | 'in_progress' | 'completed';
  'workflow_job': {
    'id': number;
    'run_id': number;
    'run_url': string;
    'node_id': string;
    'head_sha': string;
    'url': string;
    'html_url': string;
    'status': 'queued' | 'in_progress' | 'completed';
    'conclusion': 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'success' | 'skipped' | 'stale' | 'timed_out';
    'started_at': string;
    'completed_at': string;
    'name': string;
    'steps': never;
    'check_run_url': string;
    'labels': Array<knownLabel>;
  };
};
