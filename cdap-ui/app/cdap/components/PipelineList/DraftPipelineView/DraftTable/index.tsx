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
import DraftTableRow from 'components/PipelineList/DraftPipelineView/DraftTable/DraftTableRow';
import T from 'i18n-react';
import { connect } from 'react-redux';
import { IDraft } from 'components/PipelineList/DraftPipelineView/types';
import EmptyList, { VIEW_TYPES } from 'components/PipelineList/EmptyList';

interface IProps {
  drafts: IDraft[];
}

require('./DraftTable.scss');

const PREFIX = 'features.PipelineList';

const DraftTableView: React.SFC<IProps> = ({ drafts }) => {
  function renderBody() {
    if (drafts.length === 0) {
      return (
        <div className="table-body">
          <EmptyList type={VIEW_TYPES.draft} />
        </div>
      );
    }

    return (
      <div className="table-body">
        {drafts.map((draft) => {
          return <DraftTableRow draft={draft} key={draft.__ui__.draftId} />;
        })}
      </div>
    );
  }

  return (
    <div className="draft-table">
      <div className="table-header">
        <div className="table-column name">{T.translate(`${PREFIX}.pipelineName`)}</div>
        <div className="table-column type">{T.translate(`${PREFIX}.type`)}</div>
        <div className="table-column last-saved">{T.translate(`${PREFIX}.lastSaved`)}</div>
        <div className="table-column action" />
      </div>

      {renderBody()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    drafts: state.drafts.list,
  };
};

const DraftTable = connect(mapStateToProps)(DraftTableView);

export default DraftTable;
