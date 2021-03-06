/*
 * Copyright © 2018 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import * as React from 'react';
import PipelineTableRow from 'components/PipelineList/DeployedPipelineView/PipelineTable/PipelineTableRow';
import { connect } from 'react-redux';
import T from 'i18n-react';
import { IPipeline } from 'components/PipelineList/DeployedPipelineView/types';
import EmptyList, { VIEW_TYPES } from 'components/PipelineList/EmptyList';

import './PipelineTable.scss';

interface IProps {
  pipelines: IPipeline[];
}

const PREFIX = 'features.PipelineList';

const PipelineTableView: React.SFC<IProps> = ({ pipelines }) => {
  function renderBody() {
    if (pipelines.length === 0) {
      return (
        <div className="table-body">
          <EmptyList type={VIEW_TYPES.deployed} />
        </div>
      );
    }

    return (
      <div className="table-body">
        {pipelines.map((pipeline) => {
          return <PipelineTableRow key={pipeline.name} pipeline={pipeline} />;
        })}
      </div>
    );
  }

  return (
    <div className="pipeline-list-table">
      <div className="table-header">
        <div className="table-column name">{T.translate(`${PREFIX}.pipelineName`)}</div>
        <div className="table-column type">{T.translate(`${PREFIX}.type`)}</div>
        <div className="table-column status">{T.translate(`${PREFIX}.status`)}</div>
        <div className="table-column last-start">{T.translate(`${PREFIX}.lastStartTime`)}</div>
        <div className="table-column next-run">{T.translate(`${PREFIX}.nextRun`)}</div>
        <div className="table-column runs">{T.translate(`${PREFIX}.runs`)}</div>
        <div className="table-column tags">{T.translate(`${PREFIX}.tags`)}</div>
        <div className="table-column action" />
      </div>

      {renderBody()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    pipelines: state.deployed.pipelines,
  };
};

const PipelineTable = connect(mapStateToProps)(PipelineTableView);

export default PipelineTable;
