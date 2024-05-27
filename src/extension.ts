// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as vsoNodeApi from 'azure-devops-node-api';
import * as configuration from './tools/configuration';

import * as GitApi from "azure-devops-node-api/GitApi";
import * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('azdo-pull-request.getPullRequests', async () => {
		await configuration.prepareConfiguration('azdo-pull-request', 'personalAccessToken', 'Personal Access Token (PAT) for your Azure DevOps organization.');
		await configuration.prepareConfiguration('azdo-pull-request', 'organization', 'Organization');
		await configuration.prepareConfiguration('azdo-pull-request', 'project', 'Project');
		const token = vscode.workspace.getConfiguration('azdo-pull-request').get('personalAccessToken') as string;
		const organization = vscode.workspace.getConfiguration('azdo-pull-request').get('organization') as string;
		const server = `https://dev.azure.com/${organization}`;
		var project = vscode.workspace.getConfiguration('azdo-pull-request').get('project') as string
		let authHandler = vsoNodeApi.getPersonalAccessTokenHandler(token);
		let connection = new vsoNodeApi.WebApi(server, authHandler);
		connection.getGitApi().then((gitApi) => {
			gitApi.getRepository(project, project).then((repository) => {
				const searchCriteria: GitInterfaces.GitPullRequestSearchCriteria = <GitInterfaces.GitPullRequestSearchCriteria>{ status: GitInterfaces.PullRequestStatus.Active };
				gitApi.getPullRequests(repository.name as string, searchCriteria, project).then((pullRequests) => {
					vscode.window.showQuickPick(pullRequests.map((pullRequest) => {
						return pullRequest.title as string;
					}));
				}).catch((error) => {
					vscode.window.showErrorMessage(error);
				})
			}).catch((error) => {
				vscode.window.showErrorMessage(error);
			})
		}).catch((error) => {
			vscode.window.showErrorMessage(error);
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
